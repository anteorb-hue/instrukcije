import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/auth-middleware'

// GET /api/subjects - List all subjects
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const subjects = await prisma.subject.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { nameEn: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        _count: {
          select: {
            tutors: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// POST /api/subjects - Create new subject (Admin only)
export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { name, nameEn, description, icon, category } = body

    if (!name || !nameEn || !category) {
      return NextResponse.json(
        { error: 'Name, nameEn, and category are required' },
        { status: 400 }
      )
    }

    // Check if subject already exists
    const existing = await prisma.subject.findUnique({
      where: { name },
    })

    if (existing) {
      return NextResponse.json({ error: 'Subject already exists' }, { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        nameEn,
        description,
        icon,
        category,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
})
