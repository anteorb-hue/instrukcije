import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rewardReferral } from '@/lib/rewards'

export async function POST(req: Request) {
  try {
    const { name, email, password, role, referralCode } = await req.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Korisnik s tim emailom već postoji' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    // Create profile based on role
    if (role === 'TUTOR') {
      await prisma.tutorProfile.create({
        data: {
          userId: user.id,
          title: '',
          hourlyRate: 0,
          experience: 0,
        },
      })
    } else if (role === 'PARENT') {
      await prisma.parentProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else {
      // Default to STUDENT
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          educationLevel: 'OSNOVNA_SKOLA',
        },
      })
    }

    // Process referral code if provided
    if (referralCode && referralCode.trim() !== '') {
      try {
        // Find referrer by code
        const referrerPoints = await prisma.userPoints.findUnique({
          where: { referralCode: referralCode.trim() },
        })

        if (referrerPoints) {
          // Award referral points to both users
          await rewardReferral(referrerPoints.userId, user.id)
          console.log(`Referral bonus applied: ${referrerPoints.userId} -> ${user.id}`)
        } else {
          console.warn(`Invalid referral code provided: ${referralCode}`)
        }
      } catch (error) {
        console.error('Error processing referral:', error)
        // Don't fail registration if referral processing fails
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Došlo je do greške pri registraciji' },
      { status: 500 }
    )
  }
}
