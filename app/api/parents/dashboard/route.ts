import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/parents/dashboard
 * Returns comprehensive dashboard data for the authenticated parent
 * Includes: children stats, upcoming lessons, payment history, progress tracking
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Forbidden - Only parents can access this endpoint' }, { status: 403 })
    }

    // Get all parent-child relationships
    const parentChildren = await prisma.parentChild.findMany({
      where: {
        parentId: session.user.id,
      },
      include: {
        child: {
          include: {
            studentProfile: true,
            bookingsAsStudent: {
              include: {
                subject: true,
                tutor: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
                payment: true,
                review: true,
              },
            },
            payments: {
              include: {
                booking: {
                  include: {
                    subject: true,
                    tutor: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    })

    // Calculate statistics for each child
    const children = parentChildren.map((pc) => {
      const allBookings = pc.child.bookingsAsStudent
      const completedBookings = allBookings.filter((b) => b.status === 'COMPLETED')
      const upcomingBookings = allBookings.filter(
        (b) => b.status === 'SCHEDULED' && new Date(b.scheduledAt) > new Date()
      )
      const scheduledBookings = allBookings.filter((b) => b.status === 'SCHEDULED')

      // Calculate subject distribution
      const subjectStats = allBookings.reduce((acc, booking) => {
        const subjectName = booking.subject.name
        if (!acc[subjectName]) {
          acc[subjectName] = {
            total: 0,
            completed: 0,
            upcoming: 0,
          }
        }
        acc[subjectName].total++
        if (booking.status === 'COMPLETED') {
          acc[subjectName].completed++
        }
        if (booking.status === 'SCHEDULED' && new Date(booking.scheduledAt) > new Date()) {
          acc[subjectName].upcoming++
        }
        return acc
      }, {} as Record<string, { total: number; completed: number; upcoming: number }>)

      // Get unique active subjects (subjects with upcoming or recent bookings)
      const activeSubjects = Array.from(
        new Set(
          allBookings
            .filter(
              (b) =>
                b.status === 'SCHEDULED' ||
                (b.status === 'COMPLETED' && new Date(b.scheduledAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
            )
            .map((b) => b.subject.name)
        )
      )

      // Calculate average rating from reviews given to tutors
      const reviewedBookings = completedBookings.filter((b) => b.review)
      const averageRating =
        reviewedBookings.length > 0
          ? reviewedBookings.reduce((sum, b) => sum + (b.review?.rating || 0), 0) / reviewedBookings.length
          : 0

      // Get next upcoming lesson
      const nextLesson = upcomingBookings.sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )[0]

      return {
        linkId: pc.id,
        relationship: pc.relationship,
        isPrimary: pc.isPrimary,
        canBook: pc.canBook,
        canViewProgress: pc.canViewProgress,
        child: {
          id: pc.child.id,
          name: pc.child.name,
          email: pc.child.email,
          avatar: pc.child.avatar,
          phone: pc.child.phone,
          studentProfile: pc.child.studentProfile,
        },
        stats: {
          totalLessons: allBookings.length,
          completedLessons: completedBookings.length,
          scheduledLessons: scheduledBookings.length,
          upcomingLessons: upcomingBookings.length,
          averageRating: Math.round(averageRating * 10) / 10,
          activeSubjects,
          subjectStats,
        },
        nextLesson: nextLesson
          ? {
              id: nextLesson.id,
              scheduledAt: nextLesson.scheduledAt,
              duration: nextLesson.duration,
              subject: nextLesson.subject.name,
              tutor: nextLesson.tutor.name,
              tutorAvatar: nextLesson.tutor.avatar,
              meetingUrl: nextLesson.meetingUrl,
            }
          : null,
      }
    })

    // Get upcoming lessons across all children (next 7 days)
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcomingLessons = await prisma.booking.findMany({
      where: {
        studentId: {
          in: parentChildren.map((pc) => pc.childId),
        },
        status: 'SCHEDULED',
        scheduledAt: {
          gte: now,
          lte: nextWeek,
        },
      },
      include: {
        subject: true,
        tutor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 10,
    })

    // Get payment history (last 3 months)
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const payments = await prisma.payment.findMany({
      where: {
        userId: {
          in: parentChildren.map((pc) => pc.childId),
        },
        createdAt: {
          gte: threeMonthsAgo,
        },
      },
      include: {
        booking: {
          include: {
            subject: true,
            tutor: {
              select: {
                name: true,
              },
            },
            student: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    })

    // Calculate total spending
    const totalSpending = payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate spending per child
    const spendingPerChild = parentChildren.reduce((acc, pc) => {
      const childPayments = payments.filter(
        (p) => p.userId === pc.childId && p.status === 'COMPLETED'
      )
      acc[pc.child.name] = childPayments.reduce((sum, p) => sum + p.amount, 0)
      return acc
    }, {} as Record<string, number>)

    // Overall statistics
    const overallStats = {
      totalChildren: children.length,
      totalLessons: children.reduce((sum, c) => sum + c.stats.totalLessons, 0),
      completedLessons: children.reduce((sum, c) => sum + c.stats.completedLessons, 0),
      upcomingLessons: children.reduce((sum, c) => sum + c.stats.upcomingLessons, 0),
      totalSpending: Math.round(totalSpending * 100) / 100,
      spendingPerChild,
      averageRating:
        children.reduce((sum, c) => sum + c.stats.averageRating, 0) / (children.length || 1),
    }

    return NextResponse.json({
      children,
      upcomingLessons: upcomingLessons.map((lesson) => ({
        id: lesson.id,
        scheduledAt: lesson.scheduledAt,
        duration: lesson.duration,
        subject: lesson.subject.name,
        tutor: {
          id: lesson.tutor.id,
          name: lesson.tutor.name,
          avatar: lesson.tutor.avatar,
        },
        student: {
          id: lesson.student.id,
          name: lesson.student.name,
        },
        meetingUrl: lesson.meetingUrl,
        status: lesson.status,
      })),
      payments: payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
        paidAt: payment.paidAt,
        booking: {
          id: payment.booking.id,
          subject: payment.booking.subject.name,
          tutor: payment.booking.tutor.name,
          student: payment.booking.student.name,
          scheduledAt: payment.booking.scheduledAt,
        },
      })),
      overallStats,
    })
  } catch (error) {
    console.error('Error fetching parent dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
