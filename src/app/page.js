import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Imagen (No ruta relativa) */}
      <div className="mb-8">
        <Image
          src="/img/pc.jpg"
          alt="PC Components Store"
          width={300}
          height={200}
          className="rounded-lg shadow-md"
          priority
        />
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Tienda de Componentes PC
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Encuentra los mejores componentes para tu computadora
      </p>

      {/* REdirecciones a los inicios de sesion */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Iniciar Sesión
        </Link>
        
        <Link
          href="/auth/register"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Registrarse
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        Tienda de componentes
      </footer>
    </div>
  )
}