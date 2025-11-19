import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rewardReferral } from '@/lib/rewards'
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit'
import { registrationSchema, safeValidateRequest } from '@/lib/validation-schemas'

export async function POST(req: Request) {
  try {
    // RATE LIMITING: Prevent registration spam and abuse (5 attempts per 15 min per IP)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitResult = checkRateLimit(
      `register:${ip}`,
      RateLimitPresets.AUTH
    )

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Previše pokušaja registracije. Molimo pričekajte prije ponovnog pokušaja.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RateLimitPresets.AUTH.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
          },
        }
      )
    }

    const body = await req.json()

    // INPUT VALIDATION: Use Zod schema with comprehensive password validation
    const validation = safeValidateRequest(registrationSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      )
    }

    const { name, email, password, role, referralCode } = validation.data

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
