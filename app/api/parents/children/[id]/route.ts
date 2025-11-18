import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/parents/children/[id]
 * Updates parent-child relationship settings
 * [id] is the ParentChild link ID, not the child user ID
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Forbidden - Only parents can access this endpoint' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { relationship, isPrimary, canBook, canViewProgress } = body

    // Verify that the link exists and belongs to this parent
    const existingLink = await prisma.parentChild.findUnique({
      where: { id },
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Parent-child link not found' }, { status: 404 })
    }

    if (existingLink.parentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden - This link does not belong to you' }, { status: 403 })
    }

    // Update the link
    const updatedLink = await prisma.parentChild.update({
      where: { id },
      data: {
        relationship: relationship !== undefined ? relationship : existingLink.relationship,
        isPrimary: isPrimary !== undefined ? isPrimary : existingLink.isPrimary,
        canBook: canBook !== undefined ? canBook : existingLink.canBook,
        canViewProgress: canViewProgress !== undefined ? canViewProgress : existingLink.canViewProgress,
      },
      include: {
        child: {
          include: {
            studentProfile: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Link updated successfully',
      data: {
        linkId: updatedLink.id,
        relationship: updatedLink.relationship,
        isPrimary: updatedLink.isPrimary,
        canBook: updatedLink.canBook,
        canViewProgress: updatedLink.canViewProgress,
        child: {
          id: updatedLink.child.id,
          name: updatedLink.child.name,
          email: updatedLink.child.email,
          avatar: updatedLink.child.avatar,
          phone: updatedLink.child.phone,
          studentProfile: updatedLink.child.studentProfile,
        },
      },
    })
  } catch (error) {
    console.error('Error updating parent-child link:', error)
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
  }
}

/**
 * DELETE /api/parents/children/[id]
 * Removes parent-child link (does not delete the child account)
 * [id] is the ParentChild link ID, not the child user ID
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Forbidden - Only parents can access this endpoint' }, { status: 403 })
    }

    const { id } = params

    // Verify that the link exists and belongs to this parent
    const existingLink = await prisma.parentChild.findUnique({
      where: { id },
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Parent-child link not found' }, { status: 404 })
    }

    if (existingLink.parentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden - This link does not belong to you' }, { status: 403 })
    }

    // Delete the link
    await prisma.parentChild.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Link removed successfully',
    })
  } catch (error) {
    console.error('Error deleting parent-child link:', error)
    return NextResponse.json({ error: 'Failed to remove link' }, { status: 500 })
  }
}
