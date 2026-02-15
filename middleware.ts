import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  // Check maintenance mode
  try {
    const settingsResponse = await fetch(`${req.nextUrl.origin}/api/admin/settings`)
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json()
      
      // If maintenance mode is enabled and user is not admin, show maintenance page
      if (settings.maintenanceMode && (!token || token.role !== 'ADMIN')) {
        // Allow access to auth pages and maintenance page
        if (pathname.startsWith('/auth') || pathname === '/maintenance') {
          return NextResponse.next()
        }
        
        // Redirect to maintenance page for all other routes
        return NextResponse.redirect(new URL('/maintenance', req.url))
      }
    }
  } catch (error) {
    // If we can't fetch settings, continue normally
    console.error('Error fetching settings in middleware:', error)
  }

  // Check Google Auth setting for auth pages
  if (pathname.startsWith('/auth')) {
    try {
      const settingsResponse = await fetch(`${req.nextUrl.origin}/api/admin/settings`)
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json()
        
        // If Google Auth is disabled, hide Google provider
        // This will be handled in the auth pages themselves
      }
    } catch (error) {
      console.error('Error fetching settings for auth:', error)
    }
  }

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
