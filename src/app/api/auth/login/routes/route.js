/*
https://dev.to/turingvangisms/nextjs-api-post-example-4ili

https://nextjs.org/docs/app/api-reference/functions/next-response#json

https://www.wisp.blog/blog/nextjs-15-api-get-and-post-request-examples

https://medium.com/@patel.d/code-example-add-post-api-in-next-js-app-router-503ff9f397fa

https://medium.com/@dorinelrushi8/how-to-create-a-login-page-in-next-js-f4c57b8b387d
*/


import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { correo, contrasena } = await request.json()

    // Por si faltan campos
    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Conexion a la base de datos (desde mongodb.js, exportamos la conexion "CientPromise") y esperamos
    // la cionexion. BUscamos la coleccion usuarios y buscamos el email del usuario al en teoria ser unico
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const usuarios = db.collection('usuarios')

    // Buscar el usuario
    const usuario = await usuarios.findOne({ correo })
    if (!usuario) {
      //No esta registrado
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar la contraseña
    // bycript https://clerk.com/blog/password-based-authentication-nextjs

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!contrasenaValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear el token Json Web Token
    // https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d

    const token = jwt.sign(
      { 
        userId: usuario._id,
        email: usuario.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP } 
    )

    return NextResponse.json(
      { 
        message: 'Login exitoso',
        token,
        user: {
          id: usuario._id,
          email: usuario.email
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
