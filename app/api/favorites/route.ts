import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get user's favorites
export async function GET(req: Request) {
  try {
    // TODO: Get userId from session/auth
    const userId = 'mock-user-id' // Replace with actual auth

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        user: {
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
            userPoints: true,
          },
        },
      },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju favorita' },
      { status: 500 }
    )
  }
}

// Add to favorites
export async function POST(req: Request) {
  try {
    const { tutorId } = await req.json()

    // TODO: Get userId from session/auth
    const userId = 'mock-user-id' // Replace with actual auth

    if (!tutorId) {
      return NextResponse.json(
        { error: 'tutorId je obavezan' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Instruktor je već u favoritima' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        tutorId,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Greška pri dodavanju favorita' },
      { status: 500 }
    )
  }
}

// Remove from favorites
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tutorId = searchParams.get('tutorId')

    // TODO: Get userId from session/auth
    const userId = 'mock-user-id' // Replace with actual auth

    if (!tutorId) {
      return NextResponse.json(
        { error: 'tutorId je obavezan' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Greška pri uklanjanju favorita' },
      { status: 500 }
    )
  }
}
