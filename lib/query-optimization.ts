/**
 * Query optimization helpers for Prisma
 *
 * Ove funkcije pomažu u optimizaciji Prisma upita tako što vraćaju
 * samo potrebna polja umjesto cijelog objekta.
 */

// User select - samo osnovne informacije
export const userBasicSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
} as const

// User select - za javne profile
export const userPublicSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
  role: true,
} as const

// Tutor select - za listing
export const tutorListingSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
  tutorProfile: {
    select: {
      id: true,
      verified: true,
      hourlyRate: true,
      averageRating: true,
      totalSessions: true,
      subjects: {
        select: {
          subject: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
        take: 5,
      },
    },
  },
} as const

// Material select - za listing
export const materialListingSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  fileUrl: true,
  thumbnailUrl: true,
  downloads: true,
  createdAt: true,
  subject: {
    select: {
      id: true,
      name: true,
      category: true,
    },
  },
  uploader: {
    select: userPublicSelect,
  },
} as const

// Test select - za listing
export const testListingSelect = {
  id: true,
  title: true,
  description: true,
  difficulty: true,
  duration: true,
  totalPoints: true,
  isPublic: true,
  isActive: true,
  educationLevel: true,
  createdAt: true,
  subject: {
    select: {
      id: true,
      name: true,
      category: true,
    },
  },
  creator: {
    select: userPublicSelect,
  },
  _count: {
    select: {
      questions: true,
      submissions: true,
    },
  },
} as const

// Homework question select - za listing
export const homeworkQuestionListingSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  urgency: true,
  imageUrl: true,
  createdAt: true,
  subject: {
    select: {
      id: true,
      name: true,
      category: true,
    },
  },
  student: {
    select: userPublicSelect,
  },
  _count: {
    select: {
      answers: true,
    },
  },
} as const

// Booking select - za listing
export const bookingListingSelect = {
  id: true,
  scheduledAt: true,
  duration: true,
  status: true,
  type: true,
  price: true,
  createdAt: true,
  subject: {
    select: {
      id: true,
      name: true,
    },
  },
  student: {
    select: userPublicSelect,
  },
  tutor: {
    select: userPublicSelect,
  },
} as const

/**
 * Pagination helper
 *
 * @param page - Trenutna stranica (1-indexed)
 * @param limit - Broj rezultata po stranici
 * @returns skip i take za Prisma query
 */
export function getPagination(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit
  const take = Math.min(limit, 100) // Max 100 per page

  return { skip, take }
}

/**
 * Build order by clause
 *
 * @param sortBy - Polje za sortiranje
 * @param sortOrder - Redoslijed (asc/desc)
 * @returns Prisma orderBy object
 */
export function buildOrderBy(
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return { [sortBy]: sortOrder }
}

/**
 * Build search filter for multiple fields
 *
 * @param searchQuery - Upit za pretragu
 * @param fields - Polja za pretragu
 * @returns Prisma OR filter
 */
export function buildSearchFilter(searchQuery: string, fields: string[]) {
  if (!searchQuery) return {}

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchQuery,
        mode: 'insensitive' as const,
      },
    })),
  }
}

/**
 * Cache key builder za consistent caching
 */
export function buildCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|')

  return `${prefix}:${sortedParams}`
}

/**
 * Common query options za listing endpointe
 */
export function buildListingQuery({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc' as 'asc' | 'desc',
  where = {},
}: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  where?: any
}) {
  return {
    where,
    ...getPagination(page, limit),
    orderBy: buildOrderBy(sortBy, sortOrder),
  }
}
