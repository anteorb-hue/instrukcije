import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query || query.length < 2) {
      // Return popular subjects and tutors if no query
      const popularSubjects = await prisma.subject.findMany({
        take: 5,
        orderBy: {
          tutors: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          name: true,
          category: true,
          _count: {
            select: {
              tutors: true,
            },
          },
        },
      })

      return NextResponse.json({
        tutors: [],
        subjects: popularSubjects.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          tutorCount: s._count.tutors,
          type: 'subject',
        })),
        type: 'popular',
      })
    }

    // Search for matching tutors
    const tutors = await prisma.user.findMany({
      where: {
        role: 'TUTOR',
        tutorProfile: {
          verified: true,
        },
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        avatar: true,
        tutorProfile: {
          select: {
            title: true,
            averageRating: true,
            subjects: {
              take: 2,
              select: {
                subject: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        userPoints: {
          select: {
            currentTier: true,
          },
        },
      },
    })

    // Search for matching subjects
    const subjects = await prisma.subject.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            nameEn: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        _count: {
          select: {
            tutors: true,
          },
        },
      },
    })

    return NextResponse.json({
      tutors: tutors.map((t) => ({
        id: t.id,
        name: t.name,
        avatar: t.avatar,
        title: t.tutorProfile?.title,
        rating: t.tutorProfile?.averageRating,
        subjects: t.tutorProfile?.subjects.map((s) => s.subject.name) || [],
        tier: t.userPoints?.currentTier,
        type: 'tutor',
      })),
      subjects: subjects.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        tutorCount: s._count.tutors,
        type: 'subject',
      })),
      type: 'search',
    })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju prijedloga' },
      { status: 500 }
    )
  }
}
