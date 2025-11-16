import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const query = searchParams.get('query') || ''
    const subject = searchParams.get('subject') || ''
    const educationLevel = searchParams.get('educationLevel') || ''
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined

    const tutors = await prisma.user.findMany({
      where: {
        role: 'TUTOR',
        tutorProfile: {
          verified: true,
          ...(priceMin || priceMax ? {
            hourlyRate: {
              ...(priceMin ? { gte: priceMin } : {}),
              ...(priceMax ? { lte: priceMax } : {}),
            },
          } : {}),
          ...(rating ? {
            averageRating: {
              gte: rating,
            },
          } : {}),
          ...(educationLevel ? {
            educationLevels: {
              has: educationLevel,
            },
          } : {}),
        },
        ...(query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        tutorProfile: {
          include: {
            subjects: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: {
        tutorProfile: {
          averageRating: 'desc',
        },
      },
    })

    // Filter by subject if provided
    const filteredTutors = subject
      ? tutors.filter((tutor) =>
          tutor.tutorProfile?.subjects.some((s) => s.subject.name === subject)
        )
      : tutors

    return NextResponse.json(filteredTutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju instruktora' },
      { status: 500 }
    )
  }
}
