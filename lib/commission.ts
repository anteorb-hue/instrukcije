import { prisma } from './prisma'

/**
 * Get current commission rate for tutor
 * Applies active commission discount rewards
 */
export async function getTutorCommission(tutorId: string): Promise<number> {
  const DEFAULT_COMMISSION = 15 // 15% default platform commission

  try {
    // Check for active commission discount rewards
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: tutorId },
      include: {
        rewards: {
          where: {
            type: 'COMMISSION_DISCOUNT',
            used: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } },
            ],
          },
          orderBy: { value: 'desc' }, // Get the highest discount
          take: 1,
        },
      },
    })

    if (!userPoints?.rewards.length) {
      return DEFAULT_COMMISSION
    }

    const reward = userPoints.rewards[0]
    const discountedCommission = DEFAULT_COMMISSION - reward.value

    return Math.max(0, discountedCommission) // Never go below 0%
  } catch (error) {
    console.error('Error getting tutor commission:', error)
    return DEFAULT_COMMISSION
  }
}

/**
 * Check if tutor has featured status
 */
export async function hasFeaturedStatus(tutorId: string): Promise<boolean> {
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId: tutorId },
      include: {
        rewards: {
          where: {
            type: 'FEATURED',
            used: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } },
            ],
          },
          take: 1,
        },
      },
    })

    return !!(userPoints?.rewards.length)
  } catch (error) {
    console.error('Error checking featured status:', error)
    return false
  }
}

/**
 * Get all active rewards for user
 */
export async function getActiveRewards(userId: string) {
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
      include: {
        rewards: {
          where: {
            used: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } },
            ],
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return userPoints?.rewards || []
  } catch (error) {
    console.error('Error getting active rewards:', error)
    return []
  }
}

/**
 * Apply discount from voucher or free lesson reward to booking
 */
export async function applyRewardDiscount(
  userId: string,
  bookingAmount: number,
  rewardType: 'VOUCHER' | 'FREE_LESSON'
): Promise<{ discountedAmount: number; rewardId: string | null }> {
  try {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
      include: {
        rewards: {
          where: {
            type: rewardType,
            used: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } },
            ],
          },
          orderBy: { value: 'desc' }, // Use highest value first
          take: 1,
        },
      },
    })

    if (!userPoints?.rewards.length) {
      return { discountedAmount: bookingAmount, rewardId: null }
    }

    const reward = userPoints.rewards[0]
    const discount = Math.min(reward.value, bookingAmount) // Can't discount more than booking amount

    return {
      discountedAmount: bookingAmount - discount,
      rewardId: reward.id,
    }
  } catch (error) {
    console.error('Error applying reward discount:', error)
    return { discountedAmount: bookingAmount, rewardId: null }
  }
}
