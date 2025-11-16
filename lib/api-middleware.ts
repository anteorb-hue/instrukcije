// API middleware for rate limiting, validation, and error handling
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

// Rate limiting store (in-memory - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string
}

// Rate limiting middleware
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests' } = options

  return async (req: NextRequest) => {
    // Get client identifier (IP address or user ID from session)
    const identifier =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const now = Date.now()
    const key = `${identifier}:${req.nextUrl.pathname}`

    // Get or initialize rate limit data
    let limitData = rateLimitStore.get(key)

    if (!limitData || now > limitData.resetTime) {
      // Reset counter
      limitData = {
        count: 0,
        resetTime: now + windowMs,
      }
    }

    limitData.count++
    rateLimitStore.set(key, limitData)

    // Check if limit exceeded
    if (limitData.count > maxRequests) {
      return NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((limitData.resetTime - now) / 1000),
        },
        { status: 429 }
      )
    }

    // Set rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', maxRequests.toString())
    headers.set('X-RateLimit-Remaining', (maxRequests - limitData.count).toString())
    headers.set('X-RateLimit-Reset', limitData.resetTime.toString())

    return { headers, passed: true }
  }
}

// Request validation middleware using Zod
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const validated = schema.parse(body)

      return { data: validated, passed: true }
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error,
        },
        { status: 400 }
      )
    }
  }
}

// Error handling wrapper
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      console.error('[API Error]', error)

      const message = error instanceof Error ? error.message : 'Internal server error'
      const statusCode = error instanceof APIError ? error.statusCode : 500

      return NextResponse.json(
        {
          error: message,
          timestamp: new Date().toISOString(),
        },
        { status: statusCode }
      )
    }
  }
}

// Custom API Error class
export class APIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'APIError'
  }
}

// Authentication middleware
export async function requireAuth(req: NextRequest) {
  // Get token from Authorization header
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)

  // Validate token (implement your auth logic here)
  // For now, this is a mock implementation
  if (!token || token === 'invalid') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return { user: { id: '123', email: 'user@example.com' }, passed: true }
}

// CORS middleware
export function withCORS(allowedOrigins: string[] = ['*']) {
  return (req: NextRequest, res: NextResponse) => {
    const origin = req.headers.get('origin')

    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
      res.headers.set('Access-Control-Allow-Origin', origin || '*')
      res.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      res.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
      res.headers.set('Access-Control-Max-Age', '86400')
    }

    return res
  }
}

// Logging middleware
export function logRequest(req: NextRequest) {
  const start = Date.now()

  console.log('[API Request]', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString(),
  })

  return () => {
    const duration = Date.now() - start
    console.log('[API Response]', {
      url: req.url,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  }
}

// Combine multiple middlewares
export function compose(...middlewares: Function[]) {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(req)

      if (result && result.passed === false) {
        return result
      }

      if (result instanceof NextResponse) {
        return result
      }
    }

    return { passed: true }
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL format
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
