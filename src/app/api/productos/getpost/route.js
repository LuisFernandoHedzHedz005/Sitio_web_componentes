// app/api/productos/route.js
import clientPromise from '@/lib/mongodb'

const client = await clientPromise
const db = client.db(process.env.DB_NAME)

export async function GET(request) {
  try {
    const collection = db.collection('producto')
    
    // más recientes primero
    const productos = await collection.find({}).sort({ _id: -1 }).toArray()
    
    return Response.json({ productos })
    
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return Response.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const nuevoProducto = {
      nombre: body.nombre,
      marca: body.marca,
      categoria: body.categoria,
      descripcion: body.descripcion,
      imagenes: body.imagenes || [],
      especificaciones: body.especificaciones || '',
      urls_baratos: body.urls_baratos || [],
      fechaCreacion: new Date()
    }
    
    const collection = db.collection('producto')
    const result = await collection.insertOne(nuevoProducto)
    
    return Response.json({ 
      message: 'Producto creado exitosamente',
      id: result.insertedId 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error al crear producto:', error)
    return Response.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}