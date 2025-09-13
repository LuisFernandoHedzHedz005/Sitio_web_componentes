import clientPromise from '@/lib/mongodb'

const client = await clientPromise
const db = client.db(process.env.DB_NAME)

export async function GET(request) {
  try {

    const collection = db.collection('producto')

    const count = await collection.countDocuments()
    console.log('Total productos contados:', count)

    return Response.json({ count })

  } catch (error) {

    console.error('Error al contar usuarios:', error)
    return Response.json({ message: 'Error interno del servidor' }, 
        { status: 500 })
  }
}