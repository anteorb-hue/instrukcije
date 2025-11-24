import { prisma } from './prisma'

/**
 * Database helper functions for common queries and operations
 */

// User helpers
export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
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
}

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      tutorProfile: true,
      studentProfile: true,
    },
  })
}

// Booking helpers
export const getUpcomingBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      OR: [
        { studentId: userId },
        { tutorId: userId },
      ],
      scheduledAt: {
        gte: new Date(),
      },
      status: {
        notIn: ['CANCELLED'],
      },
    },
    include: {
      student: true,
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      subject: true,
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  })
}

export const getPastBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      OR: [
        { studentId: userId },
        { tutorId: userId },
      ],
      scheduledAt: {
        lt: new Date(),
      },
    },
    include: {
      student: true,
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      subject: true,
      review: true,
    },
    orderBy: {
      scheduledAt: 'desc',
    },
  })
}

export const getBookingById = async (bookingId: string) => {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      tutor: {
        include: {
          tutorProfile: true,
        },
      },
      subject: true,
      payment: true,
      review: true,
    },
  })
}

// Tutor helpers
export const getTutorByUserId = async (userId: string) => {
  return prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      subjects: {
        include: {
          subject: true,
        },
      },
    },
  })
}

export const getVerifiedTutors = async () => {
  return prisma.user.findMany({
    where: {
      role: 'TUTOR',
      tutorProfile: {
        verified: true,
      },
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
}

export const searchTutors = async (params: {
  query?: string
  subject?: string
  educationLevel?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
}) => {
  const { query, subject: _unusedSubject, educationLevel, minPrice, maxPrice, minRating } = params

  return prisma.user.findMany({
    where: {
      role: 'TUTOR',
      tutorProfile: {
        verified: true,
        ...(minPrice || maxPrice
          ? {
              hourlyRate: {
                ...(minPrice && { gte: minPrice }),
                ...(maxPrice && { lte: maxPrice }),
              },
            }
          : {}),
        ...(minRating && {
          averageRating: {
            gte: minRating,
          },
        }),
        ...(educationLevel && {
          educationLevels: {
            has: educationLevel,
          },
        }),
      },
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      }),
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
  })
}

// Review helpers
export const getTutorReviews = async (tutorId: string, limit = 10) => {
  return prisma.review.findMany({
    where: {
      reviewedId: tutorId,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      booking: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

export const calculateTutorAverageRating = async (tutorId: string) => {
  const reviews = await prisma.review.findMany({
    where: { reviewedId: tutorId },
    select: { rating: true },
  })

  if (reviews.length === 0) return 0

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return sum / reviews.length
}

// Message helpers
export const getConversation = async (userId1: string, userId2: string) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export const getUnreadMessageCount = async (userId: string) => {
  return prisma.message.count({
    where: {
      receiverId: userId,
      read: false,
    },
  })
}

export const getUserConversations = async (userId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Group by conversation (unique user pairs)
  const conversationsMap = new Map()

  messages.forEach((message) => {
    const otherUserId = message.senderId === userId ? message.receiverId : message.senderId

    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, {
        user: message.senderId === userId ? message.receiver : message.sender,
        lastMessage: message,
        unreadCount: 0,
      })
    }

    if (message.receiverId === userId && !message.read) {
      conversationsMap.get(otherUserId).unreadCount++
    }
  })

  return Array.from(conversationsMap.values())
}

// Notification helpers
export const getUnreadNotificationCount = async (userId: string) => {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  })
}

export const getUserNotifications = async (userId: string, limit = 50) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

// Subject helpers
export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export const getPopularSubjects = async (limit = 10) => {
  const subjects = await prisma.subject.findMany({
    include: {
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: {
      bookings: {
        _count: 'desc',
      },
    },
    take: limit,
  })

  return subjects
}

// Analytics helpers
export const getTutorEarnings = async (tutorId: string, startDate?: Date, endDate?: Date) => {
  return prisma.payment.aggregate({
    where: {
      booking: {
        tutorId,
        status: 'COMPLETED',
      },
      status: 'COMPLETED',
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    },
    _sum: {
      amount: true,
    },
    _count: true,
  })
}

export const getTutorStats = async (tutorId: string) => {
  const [totalBookings, completedBookings, averageRating, totalEarnings] = await Promise.all([
    prisma.booking.count({
      where: { tutorId },
    }),
    prisma.booking.count({
      where: { tutorId, status: 'COMPLETED' },
    }),
    calculateTutorAverageRating(tutorId),
    prisma.payment.aggregate({
      where: {
        booking: {
          tutorId,
          status: 'COMPLETED',
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    }),
  ])

  return {
    totalBookings,
    completedBookings,
    averageRating,
    totalEarnings: totalEarnings._sum.amount || 0,
  }
}

export const getStudentStats = async (studentId: string) => {
  const [totalBookings, completedBookings, totalSpent] = await Promise.all([
    prisma.booking.count({
      where: { studentId },
    }),
    prisma.booking.count({
      where: { studentId, status: 'COMPLETED' },
    }),
    prisma.payment.aggregate({
      where: {
        userId: studentId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    }),
  ])

  return {
    totalBookings,
    completedBookings,
    totalSpent: totalSpent._sum.amount || 0,
  }
}

// Availability helpers
export const getTutorAvailability = async (tutorId: string, date?: Date) => {
  const where: { tutorId: string; dayOfWeek?: number } = { tutorId }

  if (date) {
    const dayOfWeek = date.getDay()
    where.dayOfWeek = dayOfWeek
  }

  return prisma.availability.findMany({
    where,
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })
}

export const isTimeSlotAvailable = async (
  tutorId: string,
  startTime: Date,
  duration: number
) => {
  const endTime = new Date(startTime.getTime() + duration * 60000)

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      tutorId,
      scheduledAt: {
        lte: endTime,
      },
      status: {
        notIn: ['CANCELLED'],
      },
    },
  })

  return !conflictingBooking
}
