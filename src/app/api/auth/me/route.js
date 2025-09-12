import { NextResponse } from "next/server"
import { verificarToken } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  const decoded = verificarToken(request)
  if (!decoded) {
    return NextResponse.json(
        { error: "No autorizado" }, 
        { status: 401 })
  }

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)
  const usuarios = db.collection("usuarios")

  const usuario = await usuarios.findOne({ _id: new ObjectId(decoded.userId) })
  if (!usuario) {
    return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 })
  }

  return NextResponse.json({
    user: { id: usuario._id, 
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        email: usuario.correo, 
        rol: usuario.rol }
  })
}
