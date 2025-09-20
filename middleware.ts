import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/account', '/course-player']
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Obtener token de las cookies o headers
    const token = request.cookies.get('sb-access-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // Redirigir al login si no hay token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verificar el token con Supabase
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        // Token inválido, redirigir al login
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Token válido, continuar con la request
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Rutas públicas, continuar normalmente
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


