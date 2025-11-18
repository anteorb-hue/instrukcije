import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import {
  requireAuth,
  requireAdmin,
  requireRole,
  requireTutor,
  requireOwnership,
  withAuth,
  withAdmin,
  withTutor,
  withRole,
} from '@/lib/auth-middleware'
import { getServerSession } from 'next-auth'

// Mock getServerSession
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('requireAuth', () => {
    it('should return error when user is not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const result = await requireAuth()

      expect(result.session).toBeNull()
      expect(result.error).toBeDefined()
    })

    it('should return session when user is authenticated', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'user@test.com',
          name: 'Test User',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireAuth()

      expect(result.error).toBeNull()
      expect(result.session).toEqual(mockSession)
    })
  })

  describe('requireAdmin', () => {
    it('should return error when user is not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const result = await requireAdmin()

      expect(result.session).toBeNull()
      expect(result.error).toBeDefined()
    })

    it('should return error when user is not admin', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'student@test.com',
          name: 'Test Student',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireAdmin()

      expect(result.session).toBeNull()
      expect(result.error).toBeDefined()
    })

    it('should return session when user is admin', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireAdmin()

      expect(result.error).toBeNull()
      expect(result.session).toEqual(mockSession)
    })
  })

  describe('requireRole', () => {
    it('should return error when user does not have required role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'student@test.com',
          name: 'Test Student',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireRole('TUTOR', 'ADMIN')

      expect(result.session).toBeNull()
      expect(result.error).toBeDefined()
    })

    it('should return session when user has one of required roles', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'tutor@test.com',
          name: 'Test Tutor',
          role: 'TUTOR' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireRole('TUTOR', 'ADMIN')

      expect(result.error).toBeNull()
      expect(result.session).toEqual(mockSession)
    })
  })

  describe('requireTutor', () => {
    it('should allow TUTOR role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'tutor@test.com',
          name: 'Test Tutor',
          role: 'TUTOR' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireTutor()

      expect(result.error).toBeNull()
      expect(result.session).toEqual(mockSession)
    })

    it('should allow ADMIN role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireTutor()

      expect(result.error).toBeNull()
      expect(result.session).toEqual(mockSession)
    })

    it('should reject STUDENT role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'student@test.com',
          name: 'Test Student',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireTutor()

      expect(result.session).toBeNull()
      expect(result.error).toBeDefined()
    })
  })

  describe('requireOwnership', () => {
    it('should allow admin to access any resource', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireOwnership('different-user-id')

      expect(result.error).toBeNull()
      expect(result.isOwner).toBe(true)
    })

    it('should allow user to access own resource', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@test.com',
          name: 'Test User',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireOwnership('user-123')

      expect(result.error).toBeNull()
      expect(result.isOwner).toBe(true)
    })

    it('should reject user accessing other user resource', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@test.com',
          name: 'Test User',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const result = await requireOwnership('different-user-id')

      expect(result.session).toBeNull()
      expect(result.isOwner).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('withAuth wrapper', () => {
    it('should call handler when authenticated', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'user@test.com',
          name: 'Test User',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn().mockResolvedValue(new Response('OK'))
      const wrappedHandler = withAuth(mockHandler)

      const req = new NextRequest('http://localhost:3000/api/test')
      await wrappedHandler(req)

      expect(mockHandler).toHaveBeenCalledWith(req, mockSession, undefined)
    })

    it('should return error when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const mockHandler = vi.fn()
      const wrappedHandler = withAuth(mockHandler)

      const req = new NextRequest('http://localhost:3000/api/test')
      const response = await wrappedHandler(req)

      expect(mockHandler).not.toHaveBeenCalled()
      expect(response.status).toBe(401)
    })
  })

  describe('withAdmin wrapper', () => {
    it('should call handler when user is admin', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'ADMIN' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn().mockResolvedValue(new Response('OK'))
      const wrappedHandler = withAdmin(mockHandler)

      const req = new NextRequest('http://localhost:3000/api/admin/test')
      await wrappedHandler(req)

      expect(mockHandler).toHaveBeenCalledWith(req, mockSession, undefined)
    })

    it('should return 403 when user is not admin', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'student@test.com',
          name: 'Test Student',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn()
      const wrappedHandler = withAdmin(mockHandler)

      const req = new NextRequest('http://localhost:3000/api/admin/test')
      const response = await wrappedHandler(req)

      expect(mockHandler).not.toHaveBeenCalled()
      expect(response.status).toBe(403)
    })
  })

  describe('withRole wrapper', () => {
    it('should call handler when user has required role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'tutor@test.com',
          name: 'Test Tutor',
          role: 'TUTOR' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn().mockResolvedValue(new Response('OK'))
      const wrappedHandler = withRole(['TUTOR', 'ADMIN'], mockHandler)

      const req = new NextRequest('http://localhost:3000/api/tutor/test')
      await wrappedHandler(req)

      expect(mockHandler).toHaveBeenCalledWith(req, mockSession, undefined)
    })

    it('should return 403 when user does not have required role', async () => {
      const mockSession = {
        user: {
          id: '123',
          email: 'student@test.com',
          name: 'Test Student',
          role: 'STUDENT' as const,
        },
      }

      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn()
      const wrappedHandler = withRole(['TUTOR', 'ADMIN'], mockHandler)

      const req = new NextRequest('http://localhost:3000/api/tutor/test')
      const response = await wrappedHandler(req)

      expect(mockHandler).not.toHaveBeenCalled()
      expect(response.status).toBe(403)
    })
  })
})
