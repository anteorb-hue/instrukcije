import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/analytics/overview - Platform overview statistics (Admin only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days

    const periodDays = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Total counts
    const [
      totalUsers,
      totalTutors,
      totalStudents,
      verifiedTutors,
      totalBookings,
      completedSessions,
      totalRevenue,
      totalMaterials,
      totalTests,
      totalHomeworkQuestions,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TUTOR' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.tutorProfile.count({ where: { verified: true } }),

      // Bookings
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),

      // Revenue (sum of completed payments)
      prisma.payment
        .aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        })
        .then(res => res._sum.amount || 0),

      // Content
      prisma.material.count(),
      prisma.test.count(),
      prisma.homeworkQuestion.count(),
    ])

    // Recent growth (new in period)
    const [
      newUsers,
      newBookings,
      newMaterials,
      newTests,
      newHomeworkQuestions,
      revenueInPeriod,
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.material.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.test.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.homeworkQuestion.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.payment
        .aggregate({
          where: {
            status: 'COMPLETED',
            paidAt: { gte: startDate },
          },
          _sum: { amount: true },
        })
        .then(res => res._sum.amount || 0),
    ])

    // Average ratings
    const avgTutorRating = await prisma.review
      .aggregate({
        _avg: { rating: true },
      })
      .then(res => res._avg.rating || 0)

    // Most popular subjects
    const popularSubjects = await prisma.booking.groupBy({
      by: ['subjectId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    })

    const popularSubjectsWithNames = await Promise.all(
      popularSubjects.map(async ps => {
        const subject = await prisma.subject.findUnique({
          where: { id: ps.subjectId },
          select: { id: true, name: true, category: true },
        })
        return {
          subject,
          bookingsCount: ps._count.id,
        }
      })
    )

    // Top tutors by sessions
    const topTutors = await prisma.user.findMany({
      where: { role: 'TUTOR' },
      include: {
        tutorProfile: {
          select: {
            totalSessions: true,
            averageRating: true,
            verified: true,
          },
        },
      },
      orderBy: {
        tutorProfile: {
          totalSessions: 'desc',
        },
      },
      take: 5,
    })

    return NextResponse.json({
      totals: {
        users: totalUsers,
        tutors: totalTutors,
        students: totalStudents,
        verifiedTutors,
        bookings: totalBookings,
        completedSessions,
        revenue: totalRevenue,
        materials: totalMaterials,
        tests: totalTests,
        homeworkQuestions: totalHomeworkQuestions,
      },
      growth: {
        period: periodDays,
        newUsers,
        newBookings,
        newMaterials,
        newTests,
        newHomeworkQuestions,
        revenueInPeriod,
      },
      metrics: {
        avgTutorRating: Number(avgTutorRating.toFixed(2)),
        sessionCompletionRate:
          totalBookings > 0
            ? Number(((completedSessions / totalBookings) * 100).toFixed(2))
            : 0,
      },
      insights: {
        popularSubjects: popularSubjectsWithNames,
        topTutors: topTutors.map(t => ({
          id: t.id,
          name: t.name,
          avatar: t.avatar,
          totalSessions: t.tutorProfile?.totalSessions || 0,
          averageRating: t.tutorProfile?.averageRating || 0,
          verified: t.tutorProfile?.verified || false,
        })),
      },
    })
  } catch (error: any) {
    console.error('Error fetching overview analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch overview analytics' },
      { status: 500 }
    )
  }
}
