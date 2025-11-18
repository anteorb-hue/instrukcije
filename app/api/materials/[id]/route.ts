import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/materials/[id] - Get single material
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            tutorProfile: {
              select: {
                title: true,
                verified: true,
              },
            },
          },
        },
        subject: true,
        tags: true,
        _count: {
          select: {
            views: true,
            downloads: true,
          },
        },
      },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error fetching material:', error)
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 })
  }
}

// PUT /api/materials/[id] - Update material
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      subjectId,
      educationLevel,
      tags,
      isPublic,
      isFree,
      price,
      duration,
      pageCount,
    } = body

    // Check ownership
    const existing = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    // TODO: Check if user owns this material
    // if (existing.tutorId !== session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    // Delete existing tags
    if (tags) {
      await prisma.materialTag.deleteMany({
        where: { materialId: params.id },
      })
    }

    // Update material
    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(subjectId !== undefined && { subjectId }),
        ...(educationLevel !== undefined && { educationLevel }),
        ...(isPublic !== undefined && { isPublic }),
        ...(isFree !== undefined && { isFree }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(pageCount !== undefined && { pageCount }),
        ...(tags &&
          tags.length > 0 && {
            tags: {
              createMany: {
                data: tags.map((tag: string) => ({ tag })),
              },
            },
          }),
      },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        subject: true,
        tags: true,
      },
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 })
  }
}

// DELETE /api/materials/[id] - Delete material
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    // TODO: Check ownership
    // if (material.tutorId !== session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    // TODO: Delete file from storage (Cloudinary/S3)
    // await deleteFile(material.fileUrl)

    await prisma.material.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 })
  }
}
