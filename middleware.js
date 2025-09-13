//https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d


import { NextResponse } from "next/server"
import { verificarToken } from "@/lib/auth"

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Solo se aplica a /home/*
  const decoded = verificarToken(request)

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Protecciones específicas por rol
  if (path.startsWith("/home/administrador") && decoded.rol !== "admin") {
    return NextResponse.redirect(new URL("/home/usuario", request.url))
  }

  if (path.startsWith("/home/administrador/adminproductos") && decoded.rol !== "admin") {
    return NextResponse.redirect(new URL("/home/usuario", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/home/:path*"],
}
