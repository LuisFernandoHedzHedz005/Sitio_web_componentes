import '../styles/globals.css'
import Navbar from './Navbar'
import Footer from './Footer'

/*
    https://tailwindcss.com/docs/width
    https://tailwindcss.com/docs/background-color
    https://tailwindcss.com/docs/box-shadow
    https://tailwindcss.com/docs/flex-direction
    https://tailwindcss.com/docs/hover-focus-and-other-states
    
    https://tailwindcss.com/docs/text-align
  */

export const metadata = {
  title: 'Tienda de Componentes',
  description: 'Encuentra los mejores componentes para tu computadora',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
