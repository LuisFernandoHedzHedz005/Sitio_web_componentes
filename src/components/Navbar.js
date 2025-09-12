import Link from 'next/link'
/*
    https://tailwindcss.com/docs/width
    https://tailwindcss.com/docs/background-color
    https://tailwindcss.com/docs/box-shadow
    https://tailwindcss.com/docs/flex-direction
    https://tailwindcss.com/docs/hover-focus-and-other-states

  utilidadaes extra mas o menos por estas rutas

    https://tailwindcss.com/docs/justify-content
    
    https://tailwindcss.com/docs/text-align
  */

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">GestorPC</h1>
      <div className="flex gap-4">
        <Link href="/" className="text-gray-600 hover:text-blue-600">Inicio</Link>
        <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
        <Link href="/register" className="text-gray-600 hover:text-blue-600">Registro</Link>
      </div>
    </nav>
  )
}