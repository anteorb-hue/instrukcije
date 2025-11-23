import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    // Get current user with full profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
        studentProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Korisnik nije pronađen' },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju korisnika' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Neautorizirano' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, bio, phone, avatar, password, ...profileData } = body

    // Update basic user info
    const updateData: { name?: string; bio?: string; phone?: string; avatar?: string } = {}
    if (name) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar
    if (password) {
      updateData.password = await hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      include: {
        tutorProfile: true,
        studentProfile: true,
      },
    })

    // Update tutor profile if user is a tutor
    if (session.user.role === 'TUTOR' && Object.keys(profileData).length > 0) {
      await prisma.tutorProfile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: {
          userId: session.user.id,
          ...profileData,
        },
      })
    }

    // Update student profile if user is a student
    if (session.user.role === 'STUDENT' && Object.keys(profileData).length > 0) {
      await prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: {
          userId: session.user.id,
          ...profileData,
        },
      })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Greška pri ažuriranju korisnika' },
      { status: 500 }
    )
  }
}
