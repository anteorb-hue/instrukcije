import { prisma } from './prisma'
import { UserTier, PointTransactionType, RewardType } from '@prisma/client'

// Tier thresholds
const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 1500,
  PLATINUM: 3000,
  ELITE: 5000,
}

// Points earning/penalty values
export const POINTS = {
  // Tutor earnings
  LESSON_COMPLETED: 10,
  EXCELLENT_RATING: 5, // 5 stars
  GOOD_RATING: 2, // 4-4.9 stars
  FAST_RESPONSE: 3, // <30 min
  GROUP_LESSON: 15,
  CONSISTENCY_BONUS: 20, // 10+ lessons per month
  REFERRAL_TUTOR: 100,

  // Student earnings
  LESSON_ATTENDED: 5,
  REVIEW_LEFT: 5,
  DETAILED_REVIEW: 10, // 50+ words
  REFERRAL_STUDENT: 50,
  MONTHLY_SUBSCRIPTION: 20,
  PACKAGE_PURCHASE: 30, // 10+ lessons

  // Loyalty bonuses
  ACTIVE_STUDENT_5: 25, // 5 lessons/month
  ACTIVE_STUDENT_10: 75, // 10 lessons/month
  SIX_MONTHS_LOYALTY: 200,
  ONE_YEAR_LOYALTY: 500,

  // Penalties
  LATE_CANCELLATION: -20, // <24h
  BAD_RATING: -10, // <3 stars
  NO_SHOW: -50,
  POLICY_VIOLATION: -100, // arranging outside platform
}

/**
 * Calculate tier based on total points
 */
export function calculateTier(totalPoints: number): UserTier {
  if (totalPoints >= TIER_THRESHOLDS.ELITE) return 'ELITE'
  if (totalPoints >= TIER_THRESHOLDS.PLATINUM) return 'PLATINUM'
  if (totalPoints >= TIER_THRESHOLDS.GOLD) return 'GOLD'
  if (totalPoints >= TIER_THRESHOLDS.SILVER) return 'SILVER'
  return 'BRONZE'
}

/**
 * Get points needed for next tier
 */
export function getPointsToNextTier(currentPoints: number): number | null {
  const tiers = Object.entries(TIER_THRESHOLDS).sort((a, b) => a[1] - b[1])

  for (const [, threshold] of tiers) {
    if (currentPoints < threshold) {
      return threshold - currentPoints
    }
  }

  return null // Already at max tier
}

/**
 * Generate unique referral code for user
 */
export function generateReferralCode(userId: string, name: string): string {
  const sanitizedName = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '-')
    .substring(0, 15)

  const hash = userId.substring(0, 8)
  return `${sanitizedName}-${hash}`
}

/**
 * Add points to user account
 */
export async function addPoints(
  userId: string,
  points: number,
  type: PointTransactionType,
  reason: string,
  options?: {
    bookingId?: string
    reviewId?: string
    description?: string
    metadata?: Record<string, unknown>
  }
) {
  // Get or create user points record
  let userPoints = await prisma.userPoints.findUnique({
    where: { userId },
  })

  if (!userPoints) {
    // Create initial points record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    userPoints = await prisma.userPoints.create({
      data: {
        userId,
        totalPoints: 0,
        currentTier: 'BRONZE',
        referralCode: generateReferralCode(userId, user.name),
      },
    })
  }

  // Calculate new total
  const newTotal = Math.max(0, userPoints.totalPoints + points) // Can't go below 0
  const newTier = calculateTier(newTotal)

  // Update points and tier
  const updated = await prisma.userPoints.update({
    where: { userId },
    data: {
      totalPoints: newTotal,
      currentTier: newTier,
    },
  })

  // Create transaction record
  await prisma.pointTransaction.create({
    data: {
      userPointsId: updated.id,
      points,
      type,
      reason,
      description: options?.description,
      bookingId: options?.bookingId,
      reviewId: options?.reviewId,
      metadata: options?.metadata ? JSON.stringify(options.metadata) : null,
    },
  })

  return {
    newTotal,
    newTier,
    tierChanged: newTier !== userPoints.currentTier,
  }
}

/**
 * Process lesson completion rewards
 */
export async function rewardLessonCompletion(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
      student: true,
      subject: true,
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Reward tutor
  const tutorResult = await addPoints(
    booking.tutorId,
    POINTS.LESSON_COMPLETED,
    'EARNED',
    `Završena instrukcija - ${booking.subject.name}`,
    {
      bookingId: booking.id,
      description: `Instrukcija sa učenikom ${booking.student.name}`,
      metadata: {
        subject: booking.subject.name,
        duration: booking.duration,
        price: booking.price,
      },
    }
  )

  // Reward student
  const studentResult = await addPoints(
    booking.studentId,
    POINTS.LESSON_ATTENDED,
    'EARNED',
    `Pohađena instrukcija - ${booking.subject.name}`,
    {
      bookingId: booking.id,
      description: `Instrukcija sa instruktorom ${booking.tutor.name}`,
      metadata: {
        subject: booking.subject.name,
        duration: booking.duration,
      },
    }
  )

  return {
    tutor: tutorResult,
    student: studentResult,
  }
}

/**
 * Process review rewards
 */
export async function rewardReview(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      reviewer: true,
      reviewed: true,
      booking: {
        include: {
          subject: true,
        },
      },
    },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  // Reward reviewer for leaving review
  let reviewerPoints = POINTS.REVIEW_LEFT

  // Bonus for detailed review
  if (review.comment && review.comment.split(/\s+/).length >= 50) {
    reviewerPoints += POINTS.DETAILED_REVIEW
  }

  const reviewerResult = await addPoints(
    review.reviewerId,
    reviewerPoints,
    'EARNED',
    'Ostavljena recenzija',
    {
      reviewId: review.id,
      description: `Recenzija za ${review.reviewed.name}`,
      metadata: {
        rating: review.rating,
        hasComment: !!review.comment,
        commentLength: review.comment?.length || 0,
      },
    }
  )

  // Reward/penalize reviewed based on rating
  let reviewedPoints = 0
  let reviewedType: PointTransactionType = 'EARNED'
  let reviewedReason = ''

  if (review.rating === 5) {
    reviewedPoints = POINTS.EXCELLENT_RATING
    reviewedReason = 'Odlična ocjena (5⭐)'
  } else if (review.rating >= 4) {
    reviewedPoints = POINTS.GOOD_RATING
    reviewedReason = `Dobra ocjena (${review.rating}⭐)`
  } else if (review.rating < 3) {
    reviewedPoints = POINTS.BAD_RATING
    reviewedType = 'PENALTY'
    reviewedReason = `Loša ocjena (${review.rating}⭐)`
  }

  let reviewedResult = null
  if (reviewedPoints !== 0) {
    reviewedResult = await addPoints(
      review.reviewedId,
      reviewedPoints,
      reviewedType,
      reviewedReason,
      {
        reviewId: review.id,
        description: `Ocjena od ${review.reviewer.name}`,
        metadata: {
          rating: review.rating,
        },
      }
    )
  }

  return {
    reviewer: reviewerResult,
    reviewed: reviewedResult,
  }
}

/**
 * Process referral rewards
 */
export async function rewardReferral(referrerId: string, referredId: string) {
  const referred = await prisma.user.findUnique({
    where: { id: referredId },
    select: { name: true, role: true },
  })

  if (!referred) {
    throw new Error('Referred user not found')
  }

  const points = referred.role === 'TUTOR' ? POINTS.REFERRAL_TUTOR : POINTS.REFERRAL_STUDENT

  // Award points to referrer
  const result = await addPoints(
    referrerId,
    points,
    'BONUS',
    `Referral bonus - Novi ${referred.role.toLowerCase()}`,
    {
      description: `${referred.name} se registrirao preko vašeg linka`,
      metadata: {
        referredId,
        referredName: referred.name,
        referredRole: referred.role,
      },
    }
  )

  // Increment referral count
  await prisma.userPoints.update({
    where: { userId: referrerId },
    data: {
      totalReferrals: {
        increment: 1,
      },
    },
  })

  // Set referred by
  await prisma.userPoints.update({
    where: { userId: referredId },
    data: {
      referredBy: referrerId,
    },
  })

  return result
}

/**
 * Apply penalty
 */
export async function applyPenalty(
  userId: string,
  penaltyType: 'LATE_CANCELLATION' | 'NO_SHOW' | 'POLICY_VIOLATION' | 'BAD_RATING',
  options?: {
    bookingId?: string
    description?: string
  }
) {
  const penaltyPoints = {
    LATE_CANCELLATION: POINTS.LATE_CANCELLATION,
    NO_SHOW: POINTS.NO_SHOW,
    POLICY_VIOLATION: POINTS.POLICY_VIOLATION,
    BAD_RATING: POINTS.BAD_RATING,
  }

  const penaltyReasons = {
    LATE_CANCELLATION: 'Otkazivanje u zadnji čas (<24h)',
    NO_SHOW: 'Nepojavljivanje na zakazanoj instrukciji',
    POLICY_VIOLATION: 'Kršenje pravila platforme',
    BAD_RATING: 'Loša ocjena od korisnika',
  }

  return addPoints(
    userId,
    penaltyPoints[penaltyType],
    'PENALTY',
    penaltyReasons[penaltyType],
    {
      bookingId: options?.bookingId,
      description: options?.description,
    }
  )
}

/**
 * Redeem reward
 */
export async function redeemReward(
  userId: string,
  rewardType: RewardType,
  title: string,
  pointsCost: number,
  value: number,
  options?: {
    validDays?: number
    description?: string
    metadata?: Record<string, unknown>
  }
) {
  const userPoints = await prisma.userPoints.findUnique({
    where: { userId },
  })

  if (!userPoints) {
    throw new Error('User points not found')
  }

  if (userPoints.totalPoints < pointsCost) {
    throw new Error('Insufficient points')
  }

  // Deduct points
  await addPoints(
    userId,
    -pointsCost,
    'SPENT',
    `Iskorištena nagrada: ${title}`,
    {
      description: options?.description,
      metadata: options?.metadata,
    }
  )

  // Create reward record
  const expiresAt = options?.validDays
    ? new Date(Date.now() + options.validDays * 24 * 60 * 60 * 1000)
    : null

  const reward = await prisma.userReward.create({
    data: {
      userPointsId: userPoints.id,
      type: rewardType,
      title,
      description: options?.description,
      value,
      pointsCost,
      expiresAt,
      metadata: options?.metadata ? JSON.stringify(options.metadata) : null,
    },
  })

  return reward
}

/**
 * Get user points summary
 */
export async function getUserPointsSummary(userId: string) {
  let userPoints = await prisma.userPoints.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      rewards: {
        where: {
          OR: [
            { used: false },
            {
              used: true,
              usedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!userPoints) {
    // Create if doesn't exist
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    userPoints = await prisma.userPoints.create({
      data: {
        userId,
        totalPoints: 0,
        currentTier: 'BRONZE',
        referralCode: generateReferralCode(userId, user.name),
      },
      include: {
        transactions: true,
        rewards: true,
      },
    })
  }

  const pointsToNextTier = getPointsToNextTier(userPoints.totalPoints)

  return {
    ...userPoints,
    pointsToNextTier,
    tierThresholds: TIER_THRESHOLDS,
  }
}

/**
 * Get available rewards from catalog
 */
export async function getAvailableRewards(userId?: string) {
  let userRole = null

  // Get user role if userId provided
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    userRole = user?.role
  }

  // Fetch catalog filtered by user role
  const catalog = await prisma.rewardCatalog.findMany({
    where: {
      active: true,
      OR: [
        { userRole: null }, // Available for all
        ...(userRole ? [{ userRole }] : []),
      ],
    },
    orderBy: { pointsCost: 'asc' },
  })

  // If userId provided, check how many times they've redeemed each
  if (userId) {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
      include: {
        rewards: {
          select: { type: true },
        },
      },
    })

    if (userPoints) {
      return catalog.map((item) => {
        const timesRedeemed = userPoints.rewards.filter((r) => r.type === item.type).length
        const canRedeem =
          !item.limitPerUser || timesRedeemed < item.limitPerUser

        return {
          ...item,
          timesRedeemed,
          canRedeem,
          userHasEnoughPoints: userPoints.totalPoints >= item.pointsCost,
        }
      })
    }
  }

  return catalog
}

/**
 * Use a reward
 */
export async function applyReward(rewardId: string) {
  const reward = await prisma.userReward.findUnique({
    where: { id: rewardId },
  })

  if (!reward) {
    throw new Error('Reward not found')
  }

  if (reward.used) {
    throw new Error('Reward already used')
  }

  if (reward.expiresAt && reward.expiresAt < new Date()) {
    throw new Error('Reward has expired')
  }

  return prisma.userReward.update({
    where: { id: rewardId },
    data: {
      used: true,
      usedAt: new Date(),
    },
  })
}
