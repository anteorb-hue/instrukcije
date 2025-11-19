/**
 * Authentication Middleware for API Routes
 *
 * Provides server-side authentication and authorization helpers for Next.js API routes.
 * Built on top of NextAuth.js with role-based access control (RBAC).
 *
 * @module lib/auth-middleware
 * @example
 * ```typescript
 * // Simple authentication requirement
 * import { withAuth } from '@/lib/auth-middleware'
 *
 * export const GET = withAuth(async (req, session) => {
 *   // session is guaranteed to exist here
 *   return NextResponse.json({ userId: session.user.id })
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Admin-only endpoint
 * import { withAdmin } from '@/lib/auth-middleware'
 *
 * export const DELETE = withAdmin(async (req, session) => {
 *   // Only admins can reach this code
 *   await deleteUser(req.params.id)
 *   return NextResponse.json({ success: true })
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Multiple roles allowed
 * import { withRole } from '@/lib/auth-middleware'
 *
 * export const POST = withRole(['TUTOR', 'ADMIN'], async (req, session) => {
 *   // Only tutors and admins can reach this code
 *   const data = await req.json()
 *   return NextResponse.json({ success: true })
 * })
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

/**
 * Extended session type with role-based access control
 * @interface AuthSession
 * @property {Object} user - Authenticated user information
 * @property {string} user.id - Unique user identifier (CUID)
 * @property {string} user.email - User's email address
 * @property {string} user.name - User's display name
 * @property {('STUDENT'|'TUTOR'|'ADMIN')} user.role - User's role for authorization
 * @property {string} [user.avatar] - Optional user avatar URL
 */
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
 * @description Retrieves the authenticated user session from NextAuth.
 * Returns null if user is not authenticated.
 * @returns {Promise<AuthSession | null>} Session with user data or null if not authenticated
 * @example
 * ```typescript
 * const session = await getSession()
 * if (session) {
 *   console.log(`Logged in as: ${session.user.name}`)
 * } else {
 *   console.log('Not authenticated')
 * }
 * ```
 */
export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions)
  return session as AuthSession | null
}

/**
 * Middleware to require authentication
 * @description Checks if user is authenticated. Returns 401 error if not authenticated.
 * Use this for any endpoint that requires a logged-in user.
 * @returns {Promise<{error: NextResponse | null, session: AuthSession | null}>}
 *   Object containing error response (if failed) and session (if successful)
 * @example
 * ```typescript
 * // In an API route
 * const { error, session } = await requireAuth()
 * if (error) return error
 *
 * // User is authenticated, session is guaranteed to exist
 * console.log(`User ID: ${session.user.id}`)
 * ```
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
 * @description Checks if user is authenticated AND has ADMIN role.
 * Returns 401 if not authenticated, 403 if authenticated but not an admin.
 * @returns {Promise<{error: NextResponse | null, session: AuthSession | null}>}
 *   Object containing error response (if failed) and session (if successful)
 * @example
 * ```typescript
 * // In an admin-only API route (e.g., DELETE /api/users/[id])
 * const { error, session } = await requireAdmin()
 * if (error) return error
 *
 * // User is admin, proceed with admin action
 * await deleteUser(params.id)
 * return NextResponse.json({ success: true })
 * ```
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
 * @description Flexible role checker that accepts one or more allowed roles.
 * Returns 401 if not authenticated, 403 if user's role doesn't match any allowed roles.
 * @param {...Array<'STUDENT' | 'TUTOR' | 'ADMIN'>} roles - One or more roles to allow
 * @returns {Promise<{error: NextResponse | null, session: AuthSession | null}>}
 *   Object containing error response (if failed) and session (if successful)
 * @example
 * ```typescript
 * // Allow both tutors and admins
 * const { error, session } = await requireRole('TUTOR', 'ADMIN')
 * if (error) return error
 *
 * // User is either TUTOR or ADMIN
 * console.log(`Role: ${session.user.role}`)
 * ```
 * @example
 * ```typescript
 * // Single role requirement
 * const { error, session } = await requireRole('STUDENT')
 * if (error) return error
 *
 * // User is definitely a STUDENT
 * ```
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
 * @description Convenience function for tutor-only endpoints.
 * Note: Admins can also access tutor routes (ADMIN role is implicitly allowed).
 * Returns 401 if not authenticated, 403 if not tutor/admin.
 * @returns {Promise<{error: NextResponse | null, session: AuthSession | null}>}
 *   Object containing error response (if failed) and session (if successful)
 * @example
 * ```typescript
 * // In a tutor-only API route (e.g., POST /api/bookings/accept)
 * const { error, session } = await requireTutor()
 * if (error) return error
 *
 * // User is either TUTOR or ADMIN
 * await acceptBooking(bookingId)
 * return NextResponse.json({ success: true })
 * ```
 */
export async function requireTutor() {
  return requireRole('TUTOR', 'ADMIN') // Admin can also access tutor routes
}

/**
 * Check if user owns a resource
 * @description Ensures users can only access/modify their own data.
 * Admins bypass this check (they can access all resources).
 * Returns 401 if not authenticated, 403 if not the owner.
 * @param {string} resourceUserId - The user ID that owns the resource being accessed
 * @returns {Promise<{error: NextResponse | null, session: AuthSession | null, isOwner: boolean}>}
 *   Object containing error response (if failed), session (if successful), and ownership flag
 * @example
 * ```typescript
 * // In an API route for updating user profile
 * export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
 *   const { error, session, isOwner } = await requireOwnership(params.id)
 *   if (error) return error
 *
 *   // User can only update their own profile (or admin can update anyone's)
 *   const data = await req.json()
 *   await updateUserProfile(params.id, data)
 *   return NextResponse.json({ success: true })
 * }
 * ```
 * @example
 * ```typescript
 * // For messages - ensure user can only read their own messages
 * const message = await prisma.message.findUnique({ where: { id: messageId } })
 * const { error } = await requireOwnership(message.receiverId)
 * if (error) return error
 * // User is the message receiver (or admin)
 * ```
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
 * @description Higher-order function that wraps your API route handler with authentication check.
 * Automatically returns 401 if user is not authenticated. Your handler receives guaranteed session.
 * This is the preferred way to protect API routes (cleaner than manual requireAuth calls).
 * @param {Function} handler - Your API route handler function that receives (req, session, context)
 * @returns {Function} Wrapped handler that performs authentication before calling your handler
 * @example
 * ```typescript
 * // app/api/profile/route.ts
 * import { withAuth } from '@/lib/auth-middleware'
 * import { NextRequest, NextResponse } from 'next/server'
 *
 * export const GET = withAuth(async (req, session) => {
 *   // session is guaranteed to exist here - no need for null checks
 *   const user = await prisma.user.findUnique({
 *     where: { id: session.user.id }
 *   })
 *   return NextResponse.json(user)
 * })
 * ```
 * @example
 * ```typescript
 * // With dynamic route params
 * // app/api/bookings/[id]/route.ts
 * export const GET = withAuth(async (req, session, { params }) => {
 *   const booking = await prisma.booking.findUnique({
 *     where: { id: params.id }
 *   })
 *   return NextResponse.json(booking)
 * })
 * ```
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
 * @description Higher-order function for admin-only API routes.
 * Automatically returns 401 if not authenticated, 403 if not admin.
 * Your handler only executes if user is authenticated AND has ADMIN role.
 * @param {Function} handler - Your API route handler function that receives (req, session, context)
 * @returns {Function} Wrapped handler that performs admin authorization before calling your handler
 * @example
 * ```typescript
 * // app/api/admin/users/route.ts
 * import { withAdmin } from '@/lib/auth-middleware'
 *
 * export const GET = withAdmin(async (req, session) => {
 *   // Only admins reach this code
 *   const allUsers = await prisma.user.findMany()
 *   return NextResponse.json(allUsers)
 * })
 *
 * export const DELETE = withAdmin(async (req, session, { params }) => {
 *   // Admin-only deletion
 *   await prisma.user.delete({ where: { id: params.id } })
 *   return NextResponse.json({ success: true })
 * })
 * ```
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
 * @description Higher-order function for tutor-only API routes.
 * Note: Admins can also access tutor routes (ADMIN role is implicitly allowed).
 * Automatically returns 401 if not authenticated, 403 if not tutor/admin.
 * @param {Function} handler - Your API route handler function that receives (req, session, context)
 * @returns {Function} Wrapped handler that performs tutor authorization before calling your handler
 * @example
 * ```typescript
 * // app/api/tutors/availability/route.ts
 * import { withTutor } from '@/lib/auth-middleware'
 *
 * export const POST = withTutor(async (req, session) => {
 *   // Only tutors (and admins) can set availability
 *   const availability = await req.json()
 *   await prisma.availability.create({
 *     data: { ...availability, tutorId: session.user.id }
 *   })
 *   return NextResponse.json({ success: true })
 * })
 * ```
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
 * @description Flexible higher-order function that accepts custom role combinations.
 * Use this when you need fine-grained role control (e.g., allow both STUDENT and TUTOR).
 * Automatically returns 401 if not authenticated, 403 if user's role doesn't match.
 * @param {Array<'STUDENT' | 'TUTOR' | 'ADMIN'>} roles - Array of allowed roles
 * @param {Function} handler - Your API route handler function that receives (req, session, context)
 * @returns {Function} Wrapped handler that performs role-based authorization before calling your handler
 * @example
 * ```typescript
 * // app/api/bookings/route.ts
 * import { withRole } from '@/lib/auth-middleware'
 *
 * // Both students and parents can create bookings
 * export const POST = withRole(['STUDENT', 'PARENT'], async (req, session) => {
 *   const bookingData = await req.json()
 *   const booking = await prisma.booking.create({
 *     data: { ...bookingData, studentId: session.user.id }
 *   })
 *   return NextResponse.json(booking)
 * })
 * ```
 * @example
 * ```typescript
 * // Multiple roles with dynamic params
 * export const PUT = withRole(['TUTOR', 'ADMIN'], async (req, session, { params }) => {
 *   // Tutors and admins can update session notes
 *   const data = await req.json()
 *   await prisma.session.update({
 *     where: { id: params.id },
 *     data
 *   })
 *   return NextResponse.json({ success: true })
 * })
 * ```
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
