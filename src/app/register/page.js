"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/Button"
import Layout from '@/components/Layout'

//https://medium.com/@dorinelrushi8/how-to-create-a-login-page-in-next-js-f4c57b8b387d

//https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d

//https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

export default function PaginaRegistro() {
  const [nombre, setNombre] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  /*
  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    try {
      const res = await fetch("/api/auth/login/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMensaje("¡Login exitoso!")
        
        // Redirigir según el rol del usuario
        setTimeout(() => {
          if (data.user.rol === 'admin') {
            router.push("/home/administrador")
          } else {
            router.push("/home/usuario")
          }
        }, 1000)
      } else {
        setMensaje(data.error || "Error en el login")
      }
    } catch (error) {
      setMensaje("Error de conexión. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }
  */
  
  /*
  const manejarEnvio = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/auth/register/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena, confirmarContrasena }),
    })
    const data = await res.json()
    setMensaje(data.message || data.error)
  }
  */

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)
    setMensaje("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, confirmarContrasena}),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMensaje("Registro exitoso")
        
        // Pagina de inicio
        setTimeout(() => {
          router.push("/")     
        }, 1000)
      } else {
        setMensaje(data.error || "Error al redireccionar")
      }
    } catch (error) {
      setMensaje("Error de conexión. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  /*
    https://tailwindcss.com/docs/width
    https://tailwindcss.com/docs/background-color
    https://tailwindcss.com/docs/box-shadow
    https://tailwindcss.com/docs/flex-direction
    
    https://tailwindcss.com/docs/text-align
  */

  return (
    <Layout>
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Registro</h1>
      <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="border rounded-lg p-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido Paterno"
          className="border rounded-lg p-3"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido Materno"
          className="border rounded-lg p-3"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border rounded-lg p-3"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded-lg p-3"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <input
        type="password"
        placeholder="Confirmar contraseña"
        className="border rounded-lg p-3"
        value={confirmarContrasena}
        onChange={(e) => setConfirmarContrasena(e.target.value)}
      />
        <Button type="primary">Registrarse</Button>
      </form>
      {mensaje && <p className="mt-4 text-center text-sm text-gray-600">{mensaje}</p>}
    </div>
    </Layout>
  )
}