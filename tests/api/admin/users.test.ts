import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/admin/users/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/admin/users/[id]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

vi.mock('next-auth')
vi.mock('@/lib/prisma')

describe('Admin Users API', () => {
  const mockAdminSession = {
    user: {
      id: 'admin-123',
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'ADMIN' as const,
    },
  }

  const mockStudentSession = {
    user: {
      id: 'student-123',
      email: 'student@test.com',
      name: 'Test Student',
      role: 'STUDENT' as const,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/users', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(req)

      expect(response.status).toBe(401)
    })

    it('should return 403 when user is not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockStudentSession as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(req)

      expect(response.status).toBe(403)
    })

    it('should return users list when user is admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@test.com',
          role: 'STUDENT',
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@test.com',
          role: 'TUTOR',
        },
      ]

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)
      vi.mocked(prisma.user.count).mockResolvedValue(2)

      const req = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toEqual(mockUsers)
      expect(data.total).toBe(2)
    })

    it('should filter users by role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      const mockTutors = [
        {
          id: '2',
          name: 'User 2',
          email: 'user2@test.com',
          role: 'TUTOR',
        },
      ]

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockTutors as any)
      vi.mocked(prisma.user.count).mockResolvedValue(1)

      const req = new NextRequest('http://localhost:3000/api/admin/users?role=TUTOR')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toEqual(mockTutors)
      expect(data.total).toBe(1)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'TUTOR',
          }),
        })
      )
    })

    it('should search users by name or email', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      vi.mocked(prisma.user.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.user.count).mockResolvedValue(0)

      const req = new NextRequest('http://localhost:3000/api/admin/users?search=john')
      const response = await GET(req)

      expect(response.status).toBe(200)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'john', mode: 'insensitive' } },
              { email: { contains: 'john', mode: 'insensitive' } },
            ]),
          }),
        })
      )
    })

    it('should support pagination', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      vi.mocked(prisma.user.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.user.count).mockResolvedValue(0)

      const req = new NextRequest(
        'http://localhost:3000/api/admin/users?limit=10&offset=20'
      )
      const response = await GET(req)

      expect(response.status).toBe(200)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        })
      )
    })
  })

  describe('GET /api/admin/users/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123')
      const response = await GET_BY_ID(req, { params: { id: '123' } })

      expect(response.status).toBe(401)
    })

    it('should return 403 when user is not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockStudentSession as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123')
      const response = await GET_BY_ID(req, { params: { id: '123' } })

      expect(response.status).toBe(403)
    })

    it('should return 404 when user not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users/999')
      const response = await GET_BY_ID(req, { params: { id: '999' } })

      expect(response.status).toBe(404)
    })

    it('should return user details when found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@test.com',
        role: 'STUDENT',
        tutorProfile: null,
        studentProfile: null,
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123')
      const response = await GET_BY_ID(req, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUser)
    })
  })

  describe('PUT /api/admin/users/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
      })
      const response = await PUT(req, { params: { id: '123' } })

      expect(response.status).toBe(401)
    })

    it('should return 403 when user is not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockStudentSession as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
      })
      const response = await PUT(req, { params: { id: '123' } })

      expect(response.status).toBe(403)
    })

    it('should update user when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      const updatedUser = {
        id: '123',
        name: 'Updated Name',
        email: 'test@test.com',
        role: 'STUDENT',
      }

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
      })
      const response = await PUT(req, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated Name')
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: expect.objectContaining({
          name: 'Updated Name',
        }),
      })
    })
  })

  describe('DELETE /api/admin/users/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'DELETE',
      })
      const response = await DELETE(req, { params: { id: '123' } })

      expect(response.status).toBe(401)
    })

    it('should return 403 when user is not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockStudentSession as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'DELETE',
      })
      const response = await DELETE(req, { params: { id: '123' } })

      expect(response.status).toBe(403)
    })

    it('should return 404 when user not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/admin/users/999', {
        method: 'DELETE',
      })
      const response = await DELETE(req, { params: { id: '999' } })

      expect(response.status).toBe(404)
    })

    it('should delete user when found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminSession as any)

      const mockUser = {
        id: '123',
        name: 'Test User',
        _count: {
          bookingsAsStudent: 0,
          bookingsAsTutor: 0,
        },
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as any)

      const req = new NextRequest('http://localhost:3000/api/admin/users/123', {
        method: 'DELETE',
      })
      const response = await DELETE(req, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      })
    })
  })
})
