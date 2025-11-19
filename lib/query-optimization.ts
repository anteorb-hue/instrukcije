/**
 * Query Optimization Helpers for Prisma
 *
 * Provides optimized select queries and utility functions to prevent N+1 queries,
 * reduce payload size, and improve database performance. Use these helpers to:
 * - Select only necessary fields (avoid SELECT *)
 * - Prevent over-fetching data
 * - Standardize field selection across API routes
 * - Improve response times and reduce bandwidth
 *
 * @module lib/query-optimization
 * @example
 * ```typescript
 * import { userPublicSelect, tutorListingSelect, getPagination } from '@/lib/query-optimization'
 *
 * // Fetch users with only public fields
 * const users = await prisma.user.findMany({
 *   select: userPublicSelect
 * })
 *
 * // Optimized tutor listing with pagination
 * const tutors = await prisma.user.findMany({
 *   where: { role: 'TUTOR' },
 *   select: tutorListingSelect,
 *   ...getPagination(1, 20)
 * })
 * ```
 */

/**
 * Basic user fields for internal use
 * @description Includes essential user information with email and timestamps.
 * Use for internal operations where you need user identification and email.
 * @constant
 * @example
 * ```typescript
 * const user = await prisma.user.findUnique({
 *   where: { id: userId },
 *   select: userBasicSelect
 * })
 * // Returns: { id, name, email, avatar, role, createdAt }
 * ```
 */
export const userBasicSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
} as const

/**
 * Public user fields for client-facing APIs
 * @description Minimal user information safe for public display.
 * Excludes email and sensitive data. Use for user profiles, listings, and public APIs.
 * @constant
 * @example
 * ```typescript
 * const publicProfile = await prisma.user.findUnique({
 *   where: { id: userId },
 *   select: userPublicSelect
 * })
 * // Returns: { id, name, avatar, bio, role }
 * // Email and timestamps are excluded for privacy
 * ```
 */
export const userPublicSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
  role: true,
} as const

/**
 * Optimized tutor listing with nested profile data
 * @description Comprehensive tutor information for directory/search listings.
 * Includes tutor profile stats, ratings, and top 5 subjects (prevents over-fetching).
 * Nested selects prevent N+1 queries.
 * @constant
 * @example
 * ```typescript
 * // GET /api/tutors - Tutor directory listing
 * const tutors = await prisma.user.findMany({
 *   where: { role: 'TUTOR' },
 *   select: tutorListingSelect,
 *   ...getPagination(page, 20)
 * })
 * // Returns tutor with profile stats, rating, hourly rate, and subjects
 * // Efficient: Only fetches top 5 subjects per tutor
 * ```
 */
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
        take: 5, // Performance: Limit to 5 subjects for listing
      },
    },
  },
} as const

/**
 * Learning material listing with related data
 * @description Optimized select for material directory/search.
 * Includes subject and uploader info via nested selects (prevents N+1).
 * @constant
 * @example
 * ```typescript
 * // GET /api/materials - Material library listing
 * const materials = await prisma.material.findMany({
 *   where: { isPublic: true },
 *   select: materialListingSelect,
 *   orderBy: { downloads: 'desc' }
 * })
 * // Returns materials with embedded subject and uploader data
 * // No additional queries needed for relations
 * ```
 */
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

/**
 * Test/quiz listing with aggregated counts
 * @description Optimized select for test directory with question/submission counts.
 * Uses Prisma _count to efficiently aggregate without loading relations.
 * @constant
 * @example
 * ```typescript
 * // GET /api/tests - Test library listing
 * const tests = await prisma.test.findMany({
 *   where: { isPublic: true, isActive: true },
 *   select: testListingSelect,
 *   orderBy: { createdAt: 'desc' }
 * })
 * // Returns: test metadata + question count + submission count
 * // Efficient: _count aggregates without loading all questions/submissions
 * ```
 */
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

/**
 * Homework question listing with answer count
 * @description Optimized for homework help forum/listing.
 * Includes answer count via _count (efficient aggregation).
 * @constant
 * @example
 * ```typescript
 * // GET /api/homework - Homework help forum
 * const questions = await prisma.homeworkQuestion.findMany({
 *   where: { status: 'OPEN' },
 *   select: homeworkQuestionListingSelect,
 *   orderBy: { urgency: 'desc' }
 * })
 * // Shows question with answer count, student info, and subject
 * // No N+1: All data fetched in single query
 * ```
 */
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

/**
 * Booking/session listing with participants
 * @description Optimized for booking management views.
 * Includes both student and tutor info via nested selects.
 * @constant
 * @example
 * ```typescript
 * // GET /api/bookings - My bookings (student view)
 * const bookings = await prisma.booking.findMany({
 *   where: { studentId: session.user.id },
 *   select: bookingListingSelect,
 *   orderBy: { scheduledAt: 'desc' }
 * })
 * // Returns bookings with embedded tutor/student data
 * // Efficient: No separate queries for user lookups
 * ```
 */
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
 * Pagination helper for Prisma queries
 * @description Converts page number and limit to Prisma skip/take format.
 * Automatically enforces max 100 items per page for performance.
 * @param {number} [page=1] - Current page number (1-indexed, not 0-indexed)
 * @param {number} [limit=20] - Items per page (max 100 enforced)
 * @returns {{ skip: number, take: number }} Prisma pagination object
 * @example
 * ```typescript
 * // Page 1: skip 0, take 20
 * const { skip, take } = getPagination(1, 20)
 * const results = await prisma.user.findMany({ skip, take })
 * ```
 * @example
 * ```typescript
 * // Page 3: skip 40, take 20 (items 41-60)
 * const pagination = getPagination(3, 20)
 * const results = await prisma.post.findMany({
 *   where: { published: true },
 *   ...pagination
 * })
 * ```
 * @example
 * ```typescript
 * // Enforces max 100 per page
 * getPagination(1, 500) // Returns { skip: 0, take: 100 }
 * ```
 */
export function getPagination(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit
  const take = Math.min(limit, 100) // Max 100 per page

  return { skip, take }
}

/**
 * Build Prisma orderBy clause
 * @description Creates a Prisma-compatible orderBy object from field name and direction.
 * Useful for dynamic sorting based on query parameters.
 * @param {string} [sortBy='createdAt'] - Field name to sort by
 * @param {'asc' | 'desc'} [sortOrder='desc'] - Sort direction (ascending or descending)
 * @returns {Record<string, 'asc' | 'desc'>} Prisma orderBy object
 * @example
 * ```typescript
 * // Sort by creation date (newest first) - default
 * const orderBy = buildOrderBy()
 * const posts = await prisma.post.findMany({ orderBy })
 * // Equivalent to: orderBy: { createdAt: 'desc' }
 * ```
 * @example
 * ```typescript
 * // Sort by name alphabetically
 * const orderBy = buildOrderBy('name', 'asc')
 * const users = await prisma.user.findMany({ orderBy })
 * // Equivalent to: orderBy: { name: 'asc' }
 * ```
 * @example
 * ```typescript
 * // Dynamic sorting from query params
 * const { sortBy, sortOrder } = req.query
 * const tutors = await prisma.user.findMany({
 *   where: { role: 'TUTOR' },
 *   orderBy: buildOrderBy(sortBy, sortOrder)
 * })
 * ```
 */
export function buildOrderBy(
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return { [sortBy]: sortOrder }
}

/**
 * Build search filter for multiple fields
 * @description Creates a Prisma OR filter for case-insensitive search across multiple fields.
 * Perfect for implementing search functionality in listings.
 * Returns empty object if searchQuery is empty (no filtering applied).
 * @param {string} searchQuery - Search term entered by user
 * @param {string[]} fields - Array of field names to search in
 * @returns {object} Prisma where clause with OR conditions
 * @example
 * ```typescript
 * // Search users by name or email
 * const searchFilter = buildSearchFilter('john', ['name', 'email'])
 * const users = await prisma.user.findMany({
 *   where: searchFilter
 * })
 * // SQL: WHERE (name ILIKE '%john%' OR email ILIKE '%john%')
 * ```
 * @example
 * ```typescript
 * // Search materials by title or description
 * const { search } = req.query
 * const materials = await prisma.material.findMany({
 *   where: buildSearchFilter(search, ['title', 'description']),
 *   select: materialListingSelect
 * })
 * ```
 * @example
 * ```typescript
 * // Empty search returns all results
 * buildSearchFilter('', ['name']) // Returns {}
 * // No filtering applied when search is empty
 * ```
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
 * Cache key builder for consistent caching
 * @description Generates deterministic cache keys from parameters.
 * Keys are sorted alphabetically to ensure same params = same key.
 * Use with Redis, in-memory cache, or CDN edge caching.
 * @param {string} prefix - Cache key prefix (e.g., 'tutors', 'materials')
 * @param {Record<string, any>} params - Query parameters to include in key
 * @returns {string} Deterministic cache key
 * @example
 * ```typescript
 * // Same params = same key (order doesn't matter)
 * buildCacheKey('tutors', { page: 1, subject: 'math' })
 * // Returns: "tutors:page:1|subject:math"
 *
 * buildCacheKey('tutors', { subject: 'math', page: 1 })
 * // Returns: "tutors:page:1|subject:math" (same key!)
 * ```
 * @example
 * ```typescript
 * // Use with Redis caching
 * const cacheKey = buildCacheKey('materials', {
 *   page: 1,
 *   category: 'math',
 *   sortBy: 'downloads'
 * })
 * const cached = await redis.get(cacheKey)
 * if (cached) return JSON.parse(cached)
 *
 * const results = await prisma.material.findMany({...})
 * await redis.setex(cacheKey, 300, JSON.stringify(results)) // 5 min cache
 * ```
 */
export function buildCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|')

  return `${prefix}:${sortedParams}`
}

/**
 * Build complete listing query with pagination, sorting, and filtering
 * @description All-in-one helper that combines pagination, sorting, and where clauses.
 * Perfect for creating standardized listing endpoints. Reduces boilerplate.
 * @param {object} options - Query options
 * @param {number} [options.page=1] - Current page number (1-indexed)
 * @param {number} [options.limit=20] - Items per page (max 100)
 * @param {string} [options.sortBy='createdAt'] - Field to sort by
 * @param {'asc' | 'desc'} [options.sortOrder='desc'] - Sort direction
 * @param {object} [options.where={}] - Prisma where clause for filtering
 * @returns {object} Complete Prisma query object with where, skip, take, and orderBy
 * @example
 * ```typescript
 * // Simple listing with defaults (page 1, 20 items, sorted by createdAt desc)
 * const query = buildListingQuery({})
 * const materials = await prisma.material.findMany({
 *   ...query,
 *   select: materialListingSelect
 * })
 * ```
 * @example
 * ```typescript
 * // Full-featured listing endpoint
 * export async function GET(req: NextRequest) {
 *   const { searchParams } = new URL(req.url)
 *   const page = parseInt(searchParams.get('page') || '1')
 *   const sortBy = searchParams.get('sortBy') || 'createdAt'
 *   const category = searchParams.get('category')
 *
 *   const query = buildListingQuery({
 *     page,
 *     limit: 20,
 *     sortBy,
 *     sortOrder: 'desc',
 *     where: {
 *       isPublic: true,
 *       ...(category && { category })
 *     }
 *   })
 *
 *   const tests = await prisma.test.findMany({
 *     ...query,
 *     select: testListingSelect
 *   })
 *
 *   return NextResponse.json(tests)
 * }
 * ```
 * @example
 * ```typescript
 * // Tutor search with multiple filters
 * const query = buildListingQuery({
 *   page: 2,
 *   limit: 12,
 *   sortBy: 'tutorProfile.averageRating',
 *   sortOrder: 'desc',
 *   where: {
 *     role: 'TUTOR',
 *     tutorProfile: {
 *       verified: true,
 *       hourlyRate: { lte: 50 }
 *     }
 *   }
 * })
 * const tutors = await prisma.user.findMany({
 *   ...query,
 *   select: tutorListingSelect
 * })
 * ```
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
