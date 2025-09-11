"use client"
import { useState } from "react"
import Button from "@/components/Button"
import Layout from '@/components/Layout'

//https://medium.com/@dorinelrushi8/how-to-create-a-login-page-in-next-js-f4c57b8b387d

//https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d

export default function PaginaRegistro() {
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [mensaje, setMensaje] = useState("")

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