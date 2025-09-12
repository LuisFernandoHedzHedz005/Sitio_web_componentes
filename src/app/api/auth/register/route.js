/*
https://dev.to/turingvangisms/nextjs-api-post-example-4ili

https://nextjs.org/docs/app/api-reference/functions/next-response#json

https://www.wisp.blog/blog/nextjs-15-api-get-and-post-request-examples

https://medium.com/@patel.d/code-example-add-post-api-in-next-js-app-router-503ff9f397fa

https://medium.com/@dorinelrushi8/how-to-create-a-login-page-in-next-js-f4c57b8b387d
*/

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, confirmarContrasena } = await request.json()

    if (!nombre || !apellidoPaterno  || !apellidoMaterno) {
      return NextResponse.json(
        { error: 'Completa los nombres' },
        { status: 400 }
      )
    }

    // Validacion de campos
    if (!correo || !contrasena) {
      //console.log(correo, contrasena)
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Contraseña que tenfa mas de 6 caracteres para mas seguiridad
    if (contrasena.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (!confirmarContrasena) {
      return NextResponse.json(
        { error: 'COnfirma tu contraseña' },
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
      fechaCreacion: new Date()
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