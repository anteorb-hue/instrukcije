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
    const tier = searchParams.get('tier') || ''
    const city = searchParams.get('city') || ''
    const availableDate = searchParams.get('availableDate') || ''
    const availableTime = searchParams.get('availableTime') || ''

    // Calculate dayOfWeek from date (0-6, Sunday-Saturday)
    let dayOfWeek: number | undefined
    if (availableDate) {
      const date = new Date(availableDate)
      dayOfWeek = date.getDay()
    }

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
          ...(city ? {
            city: city,
          } : {}),
        },
        ...(tier ? {
          userPoints: {
            currentTier: tier as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'ELITE',
          },
        } : {}),
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
            availability: true,
          },
        },
        userPoints: true,
      },
      orderBy: {
        tutorProfile: {
          averageRating: 'desc',
        },
      },
    })

    // Filter by subject if provided
    let filteredTutors = subject
      ? tutors.filter((tutor) =>
          tutor.tutorProfile?.subjects.some((s) => s.subject.name === subject)
        )
      : tutors

    // Filter by availability if date and time provided
    if (dayOfWeek !== undefined && availableTime) {
      filteredTutors = filteredTutors.filter((tutor) => {
        const availability = tutor.tutorProfile?.availability || []
        return availability.some((slot) => {
          // Check if day matches
          if (slot.dayOfWeek !== dayOfWeek) return false

          // Check if time is within start-end range
          // Convert HH:mm to minutes for comparison
          const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number)
            return hours * 60 + minutes
          }

          const requestedTime = timeToMinutes(availableTime)
          const slotStart = timeToMinutes(slot.startTime)
          const slotEnd = timeToMinutes(slot.endTime)

          return requestedTime >= slotStart && requestedTime <= slotEnd
        })
      })
    }

    return NextResponse.json(filteredTutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju instruktora' },
      { status: 500 }
    )
  }
}
