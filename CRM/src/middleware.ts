import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isPublicAsset = pathname.startsWith('/_next') || pathname.includes('.')
  const isApiRoute = pathname.startsWith('/api')

  if (isPublicAsset || isApiRoute) return NextResponse.next()

  // El token JWT se guarda en cookie desde el cliente al hacer login
  const token = request.cookies.get('access_token')?.value

  if (!token && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (token && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
