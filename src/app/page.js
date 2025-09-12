import Image from 'next/image'
import Layout from '../components/Layout'
import Button from '../components/Button'

/*
    https://tailwindcss.com/docs/width
    https://tailwindcss.com/docs/background-color
    https://tailwindcss.com/docs/box-shadow
    https://tailwindcss.com/docs/flex-direction
    
    Tipografias mas o menos en esta ruta
    https://tailwindcss.com/docs/text-align
  */

export default function HomePage() {
  return (
    <Layout>
      {/* Imagen */}
      <div className="mb-8">
        <Image
          src="/img/pc.jpg"
          alt="Cargando..."
          width={300}
          height={200}
          className="rounded-lg shadow-md"
          priority
        />
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Gestor de componentes de PC
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Organiza tus componentes!
      </p>

      {/* Botones reutilizando el componente */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="primary" href="/login"> Iniciar Sesión</Button>
        <Button type="secondary" href="/register">Registrarse</Button>
      </div>
    </Layout>
  )
}
