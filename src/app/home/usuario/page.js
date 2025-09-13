"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function ComponentesUsuarios() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [imagenesError, setImagenesError] = useState({})
  const [usuario, setUsuario] = useState(null)
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

  useEffect(() => {
    verificarAutenticacion()
  }, [])

  const verificarAutenticacion = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        
        setUsuario(data.user)
        await cargarProductos()
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      router.push('/login')
    } finally {
      setCargando(false)
    }
  }

  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos/getpost', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        setProductos(data.productos || [])
      } else {
        console.error('Error al cargar productos')
        if (res.status === 401 || res.status === 403) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const manejarErrorImagen = (productoId, imagenIndex) => {
    setImagenesError(prev => ({
      ...prev,
      [`${productoId}-${imagenIndex}`]: true
    }))
  }

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = filtroCategoria === 'todas' || producto.categoria === filtroCategoria
    const coincideBusqueda = !busqueda || 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  const abrirDetalle = (producto) => {
    setProductoSeleccionado(producto)
  }

  const cerrarDetalle = () => {
    setProductoSeleccionado(null)
  }

  const manejarCerrarSesion = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      router.push('/login')
    }
  }

  if (cargando) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <p className="text-lg">Cargando componentes...</p>
        </div>
      </Layout>
    )
  }

  if (!usuario) {
    return null
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Componentes de PC</h1>
          <p className="text-gray-600">
            Bienvenido {usuario.nombre}, encuentra el componente que más se acomode a ti
          </p>
          <div className="flex justify-start mt-4">
            <Button type="secondary" onClick={manejarCerrarSesion}>
                Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* funcionalidades*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar componente:
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría:
            </label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <p className="text-lg">No se encontraron componentes</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            productosFiltrados.map((producto) => (
              <div key={producto._id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                   onClick={() => abrirDetalle(producto)}>
                
                {/* img */}
                <div className="h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                  {producto.imagenes && producto.imagenes.length > 0 && !imagenesError[`${producto._id}-0`] ? (
                    <img 
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                      onError={() => manejarErrorImagen(producto._id, 0)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-sm">Sin imagen</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* info*/}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {producto.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{producto.nombre}</h3>
                  <p className="text-gray-600 font-medium mb-2">{producto.marca}</p>
                  <p className="text-gray-500 text-sm line-clamp-2">{producto.descripcion}</p>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {producto.urls_baratos && producto.urls_baratos.length > 0 
                        ? `${producto.urls_baratos.length} tienda${producto.urls_baratos.length > 1 ? 's' : ''}`
                        : 'Sin enlaces'
                      }
                    </span>
                    <Button type="primary" onClick={(e) => {
                      e.stopPropagation()
                      abrirDetalle(producto)
                    }}>
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* modal */}
        {productoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{productoSeleccionado.nombre}</h2>
                    <p className="text-lg text-gray-600">{productoSeleccionado.marca}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-2">
                      {productoSeleccionado.categoria}
                    </span>
                  </div>
                  <button 
                    onClick={cerrarDetalle}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Imágenes</h3>
                    {productoSeleccionado.imagenes && productoSeleccionado.imagenes.length > 0 ? (
                      <div className="space-y-3">
                        {productoSeleccionado.imagenes.map((imagen, index) => (
                          !imagenesError[`${productoSeleccionado._id}-${index}`] ? (
                            <img 
                              key={index}
                              src={imagen}
                              alt={`${productoSeleccionado.nombre} - Imagen ${index + 1}`}
                              className="w-full rounded-lg border"
                              onError={() => manejarErrorImagen(productoSeleccionado._id, index)}
                            />
                          ) : (
                            <div key={index} className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center text-gray-400">
                                <div className="text-4xl mb-2">🖼️</div>
                                <p className="text-sm">Imagen no disponible</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-6xl mb-4">📦</div>
                          <p>Sin imágenes disponibles</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-700">{productoSeleccionado.descripcion}</p>
                    </div>

                    {productoSeleccionado.especificaciones && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Especificaciones</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {productoSeleccionado.especificaciones}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* urls baratas */}
                    {productoSeleccionado.urls_baratos && productoSeleccionado.urls_baratos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Dónde comprarlo</h3>
                        <div className="space-y-2">
                          {productoSeleccionado.urls_baratos.map((url, index) => (
                            <a 
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-green-800 font-medium">
                                  Tienda {index + 1}
                                </span>
                                <span className="text-green-600 text-sm">
                                  Visitar tienda →
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                <div className="flex justify-end">
                  <Button type="secondary" onClick={cerrarDetalle}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}