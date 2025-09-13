"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function PaginaAdministrador() {
  const [usuario, setUsuario] = useState(null)
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalProductos: 0
  })
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (res.ok) {
          const data = await res.json()
          // Verificar admin
          if (data.user.rol !== 'admin') {
            router.push('/home/usuario')
            return
          }
          setUsuario(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
        router.push('/login')
      } finally {
        setCargando(false)
      }
    }

    const obtenerEstadisticas = async () => {
      try {
        const [resUsuarios, resProductos] = await Promise.all([
          fetch('/api/usuarios/count', { 
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          fetch('/api/productos/count', { 
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        ])

        let totalUsuarios = 0
        let totalProductos = 0

        if (resUsuarios.ok) {
          const dataUsuarios = await resUsuarios.json()
          totalUsuarios = dataUsuarios.count || 0
        } else {
          console.error('Error al obtener conteo de usuarios:', resUsuarios.status)
        }

        if (resProductos.ok) {
          const dataProductos = await resProductos.json()
          //console.log('Total productos:', dataProductos)
          totalProductos = dataProductos.count || 0
          //console.log('Total productos:', totalProductos)
        } else {
          console.error('Error al obtener conteo de productos:', resProductos.status)
        }
        
        setEstadisticas({
          totalUsuarios,
          totalProductos
        })
        
      } catch (error) {
        console.error('Error al obtener estadísticas:', error)
        setEstadisticas({
          totalUsuarios: 0,
          totalProductos: 0
        })
      }
    }

    obtenerUsuario()
    obtenerEstadisticas()
  }, [router])

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

  const navegarAProductos = () => {
    router.push('/home/administrador/adminproductos')
  }

  const navegarAUsuarios = () => {
    router.push('/admin/usuarios')
  }

  if (cargando) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <p className="text-lg">Cargando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/img/pc.jpg"
              alt="PC Components Admin"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel Administrador</h1>
              <p className="text-gray-600">Bienvenido, {usuario?.nombre}</p>
            </div>
          </div>
          <Button type="secondary" onClick={manejarCerrarSesion}>
            Cerrar Sesión
          </Button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Estadísticas del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-4xl font-bold text-blue-600 mb-2">{estadisticas.totalUsuarios}</p>
              <p className="text-gray-600 font-medium">Usuarios Registrados</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border border-purple-100">
              <div className="text-4xl mb-2">🖥️</div>
              <p className="text-4xl font-bold text-purple-600 mb-2">{estadisticas.totalProductos}</p>
              <p className="text-gray-600 font-medium">Productos Disponibles</p>
            </div>
          </div>
        </div>

        {/* COMP */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-2">
            Gestiona componentes de PC especializados
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">CPU</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">GPU</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">RAM</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Placa Madre</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Refrigeración</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Gabinete</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Ventiladores</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {/* Gestionar Productos */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-6">🖥️</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Gestionar Productos
            </h3>
            <p className="text-blue-600 mb-6 text-lg">
              Administra componentes de PC: CPU, GPU, RAM, placas madre, refrigeración, gabinetes y ventiladores
            </p>
            <div className="space-y-3">
              <p className="text-sm text-blue-500 font-medium">
                • Agregar nuevos componentes
              </p>
              <p className="text-sm text-blue-500 font-medium">
                • Editar especificaciones
              </p>
              <p className="text-sm text-blue-500 font-medium">
                • Eliminar productos 
              </p>
            </div>
            <div className="mt-6">
              <Button type="primary" onClick={navegarAProductos}>
                Administrar Productos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}