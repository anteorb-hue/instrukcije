import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// POST /api/admin/users/[id]/verify - Verify tutor (Admin only)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { verified } = body

    if (typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'Verified status is required (boolean)' },
        { status: 400 }
      )
    }

    // Check if user is a tutor
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        tutorProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role !== 'TUTOR' || !user.tutorProfile) {
      return NextResponse.json(
        { error: 'User is not a tutor' },
        { status: 400 }
      )
    }

    // Update tutor verification status
    const tutorProfile = await prisma.tutorProfile.update({
      where: { userId: params.id },
      data: { verified },
    })

    // Send notification to tutor
    try {
      const message = verified
        ? 'Vaš tutor profil je verificiran!'
        : 'Vaša verifikacija je uklonjena.'

      await prisma.notification.create({
        data: {
          userId: params.id,
          type: verified ? 'tutor_verified' : 'tutor_unverified',
          title: verified ? 'Profil verificiran' : 'Verifikacija uklonjena',
          message,
        },
      })

      // Send email
      await sendEmail({
        to: user.email,
        subject: verified ? 'Profil verificiran!' : 'Verifikacija uklonjena',
        html: `
          <h2>Pozdrav ${user.name},</h2>
          <p>${message}</p>
          ${
            verified
              ? '<p>Čestitamo! Sada imate verified badge na vašem profilu.</p>'
              : '<p>Kontaktirajte support za više informacija.</p>'
          }
        `,
      })
    } catch (emailError) {
      console.error('Error sending notification:', emailError)
    }

    return NextResponse.json({
      success: true,
      verified: tutorProfile.verified,
    })
  } catch (error: any) {
    console.error('Error verifying tutor:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify tutor' },
      { status: 500 }
    )
  }
}
