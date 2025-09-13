import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, context) { 
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    const productoActualizado = {
      nombre: body.nombre,
      marca: body.marca,
      categoria: body.categoria,
      descripcion: body.descripcion,
      imagenes: body.imagenes || [],
      especificaciones: body.especificaciones || '',
      urls_baratos: body.urls_baratos || [],
      fechaActualizacion: new Date()
    };
    
    const collection = db.collection('producto');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: productoActualizado }
    );
    
    if (result.matchedCount === 0) {
      return Response.json({ message: 'Producto no encontrado' }, { status: 404 });
    }
    
    return Response.json({ message: 'Producto actualizado exitosamente' });
    
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return Response.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const params = await context.params;
    const { id } = params;
    
    const collection = db.collection('producto');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return Response.json({ message: 'Producto no encontrado' }, { status: 404 });
    }
    
    return Response.json({ message: 'Producto eliminado exitosamente' });
    
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return Response.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}