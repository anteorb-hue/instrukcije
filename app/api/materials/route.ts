import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { materialListingSelect, getPagination } from '@/lib/query-optimization'

// GET /api/materials - List all materials
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const type = searchParams.get('type')
    const subjectId = searchParams.get('subjectId')
    const tutorId = searchParams.get('tutorId')
    const educationLevel = searchParams.get('educationLevel')
    const search = searchParams.get('search')
    const isPublic = searchParams.get('isPublic')
    const isFree = searchParams.get('isFree')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { skip, take } = offset > 0 ? { skip: offset, take: limit } : getPagination(page, limit)

    const materials = await prisma.material.findMany({
      where: {
        ...(type ? { type: type as any } : {}),
        ...(subjectId ? { subjectId } : {}),
        ...(tutorId ? { tutorId } : {}),
        ...(educationLevel ? { educationLevel: educationLevel as any } : {}),
        ...(isPublic !== null ? { isPublic: isPublic === 'true' } : {}),
        ...(isFree !== null ? { isFree: isFree === 'true' } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { fileName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(tag
          ? {
              tags: {
                some: {
                  tag: tag,
                },
              },
            }
          : {}),
      },
      select: materialListingSelect,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    })

    // Get total count
    const total = await prisma.material.count({
      where: {
        ...(type ? { type: type as any } : {}),
        ...(subjectId ? { subjectId } : {}),
        ...(tutorId ? { tutorId } : {}),
      },
    })

    return NextResponse.json({
      materials,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

// POST /api/materials - Create new material
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      tutorId,
      title,
      description,
      type,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      subjectId,
      educationLevel,
      tags,
      isPublic,
      isFree,
      price,
      duration,
      pageCount,
    } = body

    // Validation
    if (!tutorId || !title || !type || !fileUrl || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create material
    const material = await prisma.material.create({
      data: {
        tutorId,
        title,
        description,
        type,
        fileUrl,
        fileName,
        fileSize,
        mimeType,
        ...(subjectId && { subjectId }),
        ...(educationLevel && { educationLevel }),
        isPublic: isPublic ?? true,
        isFree: isFree ?? true,
        ...(price && { price }),
        ...(duration && { duration }),
        ...(pageCount && { pageCount }),
        ...(tags &&
          tags.length > 0 && {
            tags: {
              createMany: {
                data: tags.map((tag: string) => ({ tag })),
              },
            },
          }),
      },
      select: {
        ...materialListingSelect,
        fileSize: true,
        mimeType: true,
        pageCount: true,
        duration: true,
        price: true,
        isFree: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}
