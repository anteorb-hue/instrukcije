import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/materials/route'
import { GET as GET_BY_ID } from '@/app/api/materials/[id]/route'
import { POST as DOWNLOAD } from '@/app/api/materials/[id]/download/route'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma')

describe('Materials API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/materials', () => {
    it('should return all materials with default limit', async () => {
      const mockMaterials = [
        {
          id: '1',
          title: 'Material 1',
          type: 'PDF',
          subject: { name: 'Math' },
        },
        {
          id: '2',
          title: 'Material 2',
          type: 'VIDEO',
          subject: { name: 'Physics' },
        },
      ]

      vi.mocked(prisma.material.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(prisma.material.count).mockResolvedValue(2)

      const req = new NextRequest('http://localhost:3000/api/materials')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.materials).toEqual(mockMaterials)
      expect(data.total).toBe(2)
    })

    it('should filter materials by type', async () => {
      vi.mocked(prisma.material.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.material.count).mockResolvedValue(0)

      const req = new NextRequest('http://localhost:3000/api/materials?type=PDF')
      await GET(req)

      expect(prisma.material.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'PDF',
          }),
        })
      )
    })

    it('should filter materials by subject', async () => {
      vi.mocked(prisma.material.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.material.count).mockResolvedValue(0)

      const req = new NextRequest(
        'http://localhost:3000/api/materials?subjectId=subject-123'
      )
      await GET(req)

      expect(prisma.material.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            subjectId: 'subject-123',
          }),
        })
      )
    })

    it('should search materials by title or description', async () => {
      vi.mocked(prisma.material.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.material.count).mockResolvedValue(0)

      const req = new NextRequest('http://localhost:3000/api/materials?search=calculus')
      await GET(req)

      expect(prisma.material.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'calculus', mode: 'insensitive' } },
              { description: { contains: 'calculus', mode: 'insensitive' } },
            ]),
          }),
        })
      )
    })

    it('should support pagination', async () => {
      vi.mocked(prisma.material.findMany).mockResolvedValue([] as any)
      vi.mocked(prisma.material.count).mockResolvedValue(0)

      const req = new NextRequest('http://localhost:3000/api/materials?limit=20&offset=10')
      await GET(req)

      expect(prisma.material.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 20,
        })
      )
    })
  })

  describe('GET /api/materials/[id]', () => {
    it('should return 404 when material not found', async () => {
      vi.mocked(prisma.material.findUnique).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/materials/999')
      const response = await GET_BY_ID(req, { params: { id: '999' } })

      expect(response.status).toBe(404)
    })

    it('should return material details when found', async () => {
      const mockMaterial = {
        id: '1',
        title: 'Test Material',
        description: 'Test Description',
        type: 'PDF',
        subject: { id: 's1', name: 'Math' },
        uploader: { id: 'u1', name: 'Tutor' },
      }

      vi.mocked(prisma.material.findUnique).mockResolvedValue(mockMaterial as any)

      const req = new NextRequest('http://localhost:3000/api/materials/1')
      const response = await GET_BY_ID(req, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockMaterial)
    })
  })

  describe('POST /api/materials/[id]/download', () => {
    it('should increment download count', async () => {
      const mockMaterial = {
        id: '1',
        title: 'Test Material',
        downloads: 5,
      }

      vi.mocked(prisma.material.findUnique).mockResolvedValue(mockMaterial as any)
      vi.mocked(prisma.material.update).mockResolvedValue({
        ...mockMaterial,
        downloads: 6,
      } as any)

      const req = new NextRequest('http://localhost:3000/api/materials/1/download', {
        method: 'POST',
        body: JSON.stringify({ userId: null }),
      })
      const response = await DOWNLOAD(req, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.material.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { downloads: { increment: 1 } },
      })
    })

    it('should return 404 when material not found', async () => {
      vi.mocked(prisma.material.findUnique).mockResolvedValue(null)

      const req = new NextRequest('http://localhost:3000/api/materials/999/download', {
        method: 'POST',
        body: JSON.stringify({ userId: null }),
      })
      const response = await DOWNLOAD(req, { params: { id: '999' } })

      expect(response.status).toBe(404)
    })
  })
})
