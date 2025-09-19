/*
https://dev.to/turingvangisms/nextjs-api-post-example-4ili

https://nextjs.org/docs/app/api-reference/functions/next-response#json

https://www.wisp.blog/blog/nextjs-15-api-get-and-post-request-examples

https://medium.com/@patel.d/code-example-add-post-api-in-next-js-app-router-503ff9f397fa

https://medium.com/@dorinelrushi8/how-to-create-a-login-page-in-next-js-f4c57b8b387d
*/

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dns from "dns/promises";

//https://github.com/disposable-email-domains/disposable-email-domains/blob/main/README.md

let blocklist;

async function isDisposable(email) {
  if (!blocklist) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'lib', 'disposable_email_blocklist.conf');
      const content = await fs.readFile(filePath, { encoding: 'utf-8' });
      
      //blocklist = content.split('\r\n').slice(0, -1)
      blocklist = content.split('\n').filter(line => line.trim() !== '');
      console.log('lista leida');

    } catch (error) {
      console.error('Error crítico: No se pudo leer la lista de dominios bloqueados.', error);
      return false;
    }
  }

  const domain = email.split('@')[1];
  return blocklist.includes(domain);
}

//https://www.youtube.com/watch?v=rkiDp_t8pT8

/*
async function estructura_de_correos(correo) {
   var expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

   if (expReg.test(correo) == false) {
      return NextResponse.json({ error: 'El formato del correo es inválido' }, { status: 400 });
   } else {
      return true;
   }
}
   */

function estructura_de_correos(correo) {
  const expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return expReg.test(correo);
}

//https://medium.com/@python-javascript-php-html-css/ensuring-email-validity-with-node-js-c22d9dbd62a7

async function validarDominio(correo) {
  const dominio = correo.split("@")[1];
  try {
    const registros = await dns.resolveMx(dominio);
    return registros && registros.length > 0;
  } catch (err) { 
    console.error('Error al resolver el dominio:', err);
    return false;
  }
}

export async function POST(request) {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, confirmarContrasena } = await request.json();

    if (!correo || !contrasena) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    if (!estructura_de_correos(correo)) {
      return NextResponse .json({ error: 'El formato del correo es inválido' }, { status: 400 });
    }

    if (await isDisposable(correo)) {
      return NextResponse.json(
        { error: 'El registro con correos temporales no está permitido.' },
        { status: 400 }
      );
    }

    if (!await validarDominio(correo)) {
      return NextResponse.json({ error: 'El dominio del correo no es válido' }, { status: 400 });
    }

    if (contrasena.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (!confirmarContrasena) {
      return NextResponse.json(
        { error: 'Confirma tu contraseña' },
        { status: 400 }
      )
    } else if (contrasena !== confirmarContrasena) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }

    // Conexion a la base de datos (desde mongodb.js, exportamos la conexion "CientPromise") y esperamos
    // la cionexion. BUscamos la coleccion usuarios y buscamos el email del usuario al en teoria ser unico
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const usuarios = db.collection('usuarios')

    // Busacamos en la coleccion usuario y si se encuentra el email ingresado, no se puede registrar
    const usuarioExistente = await usuarios.findOne({ correo })
    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Verificar la contraseña
    // bycript https://clerk.com/blog/password-based-authentication-nextjs
    // Añadimos sal, como se menciono en clase para hacer mas segura la contraseña y usamos despues el bycript
    const sal = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(contrasena, sal)

    // Genenr usuario
    const nuevoUsuario = {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasena: hashedPassword,
      rol: 'usuario', // Rol por defecto
      fechaCreacion: new Date(),
      intentosFallidos: 0,
    }

    const resultado = await usuarios.insertOne(nuevoUsuario)

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        userId: resultado.insertedId 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}