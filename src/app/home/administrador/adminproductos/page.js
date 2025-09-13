"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function GestionProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const router = useRouter()

  const categorias = [
    'CPU',
    'GPU',
    'Tarjetas de video',
    'RAM',
    'Placa Madre',
    'Refrigeración',
    'Gabinete',
    'Ventiladores'
  ]

  const [formulario, setFormulario] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    descripcion: '',
    imagenes: [''],
    especificaciones: '',
    urls_baratos: ['']
  })

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos/getpost', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        setProductos(data.productos || [])
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setCargando(false)
    }
  }

  const manejarSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = productoEditando 
        ? `/api/productos/${productoEditando._id}`
        : '/api/productos/getpost'
      
      const method = productoEditando ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formulario,
          imagenes: formulario.imagenes.filter(img => img.trim() !== ''),
          urls_baratos: formulario.urls_baratos.filter(url => url.trim() !== '')
        })
      })

      if (res.ok) {
        cargarProductos()
        cerrarFormulario()
        alert(productoEditando ? 'Producto actualizado' : 'Producto creado')
      } else {
        alert('Error al guardar producto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar producto')
    }
  }

  const eliminarProducto = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const res = await fetch(`/api/productos/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (res.ok) {
          cargarProductos()
          alert('Producto eliminado')
        } else {
          alert('Error al eliminar producto')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar producto')
      }
    }
  }

  const editarProducto = (producto) => {
    setProductoEditando(producto)
    setFormulario({
      nombre: producto.nombre || '',
      marca: producto.marca || '',
      categoria: producto.categoria || '',
      descripcion: producto.descripcion || '',
      imagenes: producto.imagenes || [''],
      especificaciones: producto.especificaciones || '',
      urls_baratos: producto.urls_baratos || ['']
    })
    setMostrarFormulario(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setProductoEditando(null)
    setFormulario({
      nombre: '',
      marca: '',
      categoria: '',
      descripcion: '',
      imagenes: [''],
      especificaciones: '',
      urls_baratos: ['']
    })
  }

  const agregarCampo = (campo) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: [...prev[campo], '']
    }))
  }

  const removerCampo = (campo, index) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }))
  }

  const actualizarCampo = (campo, index, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: prev[campo].map((item, i) => i === index ? valor : item)
    }))
  }

  const productosFiltrados = productos.filter(producto => 
    filtroCategoria === 'todas' || producto.categoria === filtroCategoria
  )

  if (cargando) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <p className="text-lg">Cargando productos...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <p className="text-gray-600">Total: {productos.length} productos</p>
          </div>
          <div className="flex gap-3">
            <Button type="secondary" onClick={() => router.push('/home/administrador')}>
              Volver al Panel
            </Button>
            <Button type="primary" onClick={() => setMostrarFormulario(true)}>
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por categoría:
          </label>
          <select 
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {productoEditando ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              
              <form onSubmit={manejarSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={formulario.nombre}
                    onChange={(e) => setFormulario(prev => ({...prev, nombre: e.target.value}))}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Marca"
                    value={formulario.marca}
                    onChange={(e) => setFormulario(prev => ({...prev, marca: e.target.value}))}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <select
                  value={formulario.categoria}
                  onChange={(e) => setFormulario(prev => ({...prev, categoria: e.target.value}))}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Descripción"
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario(prev => ({...prev, descripcion: e.target.value}))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  required
                />

                <textarea
                  placeholder="Especificaciones"
                  value={formulario.especificaciones}
                  onChange={(e) => setFormulario(prev => ({...prev, especificaciones: e.target.value}))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (URLs):</label>
                  {formulario.imagenes.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder="URL de imagen"
                        value={img}
                        onChange={(e) => actualizarCampo('imagenes', index, e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                      />
                      {formulario.imagenes.length > 1 && (
                        <Button type="secondary" onClick={() => removerCampo('imagenes', index)}>
                          Eliminar
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="secondary" onClick={() => agregarCampo('imagenes')}>
                    Agregar Imagen
                  </Button>
                </div>

                {/* URLs baratos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URLs de tiendas:</label>
                  {formulario.urls_baratos.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder="URL de tienda (Amazon, MercadoLibre, etc.)"
                        value={url}
                        onChange={(e) => actualizarCampo('urls_baratos', index, e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                      />
                      {formulario.urls_baratos.length > 1 && (
                        <Button type="secondary" onClick={() => removerCampo('urls_baratos', index)}>
                          Eliminar
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="secondary" onClick={() => agregarCampo('urls_baratos')}>
                    Agregar URL
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="secondary" onClick={cerrarFormulario}>
                    Cancelar
                  </Button>
                  <Button type="primary">
                    {productoEditando ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista*/}
        <div className="space-y-4">
          {productosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay productos disponibles</p>
          ) : (
            productosFiltrados.map((producto) => (
              <div key={producto._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
                    <p className="text-gray-600">{producto.marca} • {producto.categoria}</p>
                    <p className="text-gray-500 text-sm mt-1">{producto.descripcion}</p>
                    {producto.imagenes && producto.imagenes.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        {producto.imagenes.length} imagen{producto.imagenes.length > 1 ? 'es' : ''}
                      </p>
                    )}
                    {producto.urls_baratos && producto.urls_baratos.length > 0 && (
                      <p className="text-xs text-green-600">
                        {producto.urls_baratos.length} enlace{producto.urls_baratos.length > 1 ? 's' : ''} de tienda{producto.urls_baratos.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button type="secondary" onClick={() => editarProducto(producto)}>
                      Editar
                    </Button>
                    <Button type="secondary" onClick={() => eliminarProducto(producto._id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}