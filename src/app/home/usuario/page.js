"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function PaginaUsuario() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Como usamos cookies httpOnly, necesitamos hacer una petición al servidor
    // para obtener la información del usuario
    const obtenerUsuario = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include' // Importante para incluir cookies
        })
        
        if (res.ok) {
          const data = await res.json()
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

    obtenerUsuario()
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
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/img/pc.jpg"
              alt="PC Components"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel Usuario</h1>
              <p className="text-gray-600">Bienvenido, {usuario?.nombre}</p>
            </div>
          </div>
          <Button type="secondary" onClick={manejarCerrarSesion}>
            Cerrar Sesión
          </Button>
        </div>

        <p className="text-lg text-gray-600 mb-8 text-center">
          Gestiona tus componentes de PC de manera sencilla
        </p>

        
      </div>
    </Layout>
  )
}