import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

// Extended session type to include role
interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: 'STUDENT' | 'TUTOR' | 'ADMIN'
    avatar?: string
  }
}

/**
 * Get the current user session from NextAuth
 * @returns Session with user data or null if not authenticated
 */
export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions)
  return session as AuthSession | null
}

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
        { status: 401 }
      ),
      session: null,
    }
  }

  return {
    error: null,
    session,
  }
}

/**
 * Middleware to require admin role
 * Returns 401 if not authenticated, 403 if not admin
 */
export async function requireAdmin() {
  const session = await getSession()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
        { status: 401 }
      ),
      session: null,
    }
  }

  if (session.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
      session: null,
    }
  }

  return {
    error: null,
    session,
  }
}

/**
 * Middleware to require specific role(s)
 * Returns 401 if not authenticated, 403 if role doesn't match
 */
export async function requireRole(...roles: Array<'STUDENT' | 'TUTOR' | 'ADMIN'>) {
  const session = await getSession()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
        { status: 401 }
      ),
      session: null,
    }
  }

  if (!roles.includes(session.user.role)) {
    return {
      error: NextResponse.json(
        {
          error: `Forbidden - Requires one of the following roles: ${roles.join(', ')}`,
        },
        { status: 403 }
      ),
      session: null,
    }
  }

  return {
    error: null,
    session,
  }
}

/**
 * Middleware to require tutor role
 * Returns 401 if not authenticated, 403 if not tutor
 */
export async function requireTutor() {
  return requireRole('TUTOR', 'ADMIN') // Admin can also access tutor routes
}

/**
 * Check if user owns a resource
 * Useful for ensuring users can only access their own data
 */
export async function requireOwnership(resourceUserId: string) {
  const session = await getSession()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
        { status: 401 }
      ),
      session: null,
      isOwner: false,
    }
  }

  // Admins can access all resources
  if (session.user.role === 'ADMIN') {
    return {
      error: null,
      session,
      isOwner: true,
    }
  }

  // Check if user owns the resource
  const isOwner = session.user.id === resourceUserId

  if (!isOwner) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden - You do not have permission to access this resource' },
        { status: 403 }
      ),
      session: null,
      isOwner: false,
    }
  }

  return {
    error: null,
    session,
    isOwner: true,
  }
}

/**
 * Wrapper for API routes that require authentication
 * Usage: export const GET = withAuth(async (req, session) => { ... })
 * Usage with params: export const GET = withAuth(async (req, session, context) => { ... })
 */
export function withAuth(
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const { error, session } = await requireAuth()

    if (error) {
      return error
    }

    return handler(req, session!, context)
  }
}

/**
 * Wrapper for API routes that require admin role
 * Usage: export const GET = withAdmin(async (req, session) => { ... })
 * Usage with params: export const GET = withAdmin(async (req, session, context) => { ... })
 */
export function withAdmin(
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const { error, session } = await requireAdmin()

    if (error) {
      return error
    }

    return handler(req, session!, context)
  }
}

/**
 * Wrapper for API routes that require tutor role
 * Usage: export const GET = withTutor(async (req, session) => { ... })
 * Usage with params: export const GET = withTutor(async (req, session, context) => { ... })
 */
export function withTutor(
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const { error, session } = await requireTutor()

    if (error) {
      return error
    }

    return handler(req, session!, context)
  }
}

/**
 * Wrapper for API routes that require specific role(s)
 * Usage: export const GET = withRole(['TUTOR', 'ADMIN'], async (req, session) => { ... })
 * Usage with params: export const GET = withRole(['TUTOR', 'ADMIN'], async (req, session, context) => { ... })
 */
export function withRole(
  roles: Array<'STUDENT' | 'TUTOR' | 'ADMIN'>,
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const { error, session } = await requireRole(...roles)

    if (error) {
      return error
    }

    return handler(req, session!, context)
  }
}
