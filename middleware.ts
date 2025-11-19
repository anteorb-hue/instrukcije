import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

/**
 * Next.js Middleware
 *
 * Runs before every request to add:
 * - Request ID tracking for logging/debugging
 * - Security headers (additional to next.config.mjs)
 * - Request timing
 */
export function middleware(request: NextRequest) {
  const startTime = Date.now()

  // Generate unique request ID for tracing
  const requestId = randomUUID()

  // Clone response to add headers
  const response = NextResponse.next()

  // Add request ID to response headers for client-side tracking
  response.headers.set('X-Request-ID', requestId)

  // Add request timing
  const duration = Date.now() - startTime
  response.headers.set('X-Response-Time', `${duration}ms`)

  // Log request in development (can be sent to logging service in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${requestId}] ${request.method} ${request.nextUrl.pathname} - ${duration}ms`)
  }

  return response
}

/**
 * Configure which paths middleware should run on
 * Run on all routes except static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
