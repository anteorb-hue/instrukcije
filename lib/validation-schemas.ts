/**
 * Zod Validation Schemas for API Input Validation
 *
 * Centralized validation to prevent:
 * - SQL injection (via Prisma + validation)
 * - XSS attacks (via input sanitization)
 * - Business logic violations
 * - Data integrity issues
 */

import { z } from 'zod'

// ============================================================================
// Common Reusable Schemas
// ============================================================================

export const emailSchema = z.string().email('Invalid email format').max(255)

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')

export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100).trim()

export const urlSchema = z.string().url('Invalid URL format').max(2048)

export const phoneSchema = z
  .string()
  .regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number format')
  .optional()

// ============================================================================
// Booking Validation
// ============================================================================

export const createBookingSchema = z.object({
  tutorId: z.string().cuid('Invalid tutor ID'),
  subjectId: z.string().cuid('Invalid subject ID'),
  scheduledAt: z.string().datetime('Invalid date format'),
  duration: z.number().int().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours'),
  videoProvider: z.enum(['ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS']),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
})

// ============================================================================
// Review Validation
// ============================================================================

export const ratingSchema = z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5')

export const createReviewSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
  rating: ratingSchema,
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment cannot exceed 1000 characters'),
  communication: ratingSchema.optional(),
  expertise: ratingSchema.optional(),
  punctuality: ratingSchema.optional(),
})

// ============================================================================
// Homework Validation
// ============================================================================

export const createHomeworkSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description cannot exceed 5000 characters'),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments allowed').optional(),
  subjectId: z.string().cuid('Invalid subject ID').optional(),
  educationLevel: z.enum(['OSNOVNA_SKOLA', 'SREDNJA_SKOLA', 'FAKULTET', 'OSTALO']).optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  assignedTutorId: z.string().cuid('Invalid tutor ID').optional(),
})

export const updateHomeworkSchema = createHomeworkSchema.partial()

// ============================================================================
// Homework Answer Validation
// ============================================================================

export const createHomeworkAnswerSchema = z.object({
  content: z.string().min(10, 'Answer must be at least 10 characters').max(10000, 'Answer cannot exceed 10000 characters'),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments allowed').optional(),
})

export const updateHomeworkAnswerSchema = createHomeworkAnswerSchema.partial()

// ============================================================================
// Test Validation
// ============================================================================

export const createTestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title cannot exceed 200 characters').trim(),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  instructions: z.string().max(5000, 'Instructions cannot exceed 5000 characters').optional(),
  subjectId: z.string().cuid('Invalid subject ID').optional(),
  educationLevel: z.enum(['OSNOVNA_SKOLA', 'SREDNJA_SKOLA', 'FAKULTET', 'OSTALO']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
  timeLimit: z.number().int().min(1).max(480).optional(), // 1-480 minutes
  passingScore: z.number().min(0).max(100).default(60), // percentage
  shuffleQuestions: z.boolean().default(false),
  showCorrectAnswers: z.boolean().default(true),
  allowRetake: z.boolean().default(true),
  maxAttempts: z.number().int().min(1).max(10).optional(),
  isPublic: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export const updateTestSchema = createTestSchema.partial()

// ============================================================================
// Question Validation
// ============================================================================

export const createQuestionSchema = z.object({
  questionText: z.string().min(5, 'Question must be at least 5 characters').max(5000, 'Question cannot exceed 5000 characters'),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'FILL_IN_BLANK']),
  points: z.number().min(0.5).max(100).default(1),
  options: z.array(
    z.object({
      optionText: z.string().min(1).max(500),
      isCorrect: z.boolean(),
      order: z.number().int().min(0),
    })
  ).optional(),
  correctAnswer: z.string().max(1000).optional(),
  explanation: z.string().max(2000).optional(),
  subjectId: z.string().cuid('Invalid subject ID').optional(),
  educationLevel: z.enum(['OSNOVNA_SKOLA', 'SREDNJA_SKOLA', 'FAKULTET', 'OSTALO']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).default('MEDIUM'),
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').optional(),
})

export const updateQuestionSchema = createQuestionSchema.partial()

// ============================================================================
// Message Validation
// ============================================================================

export const createMessageSchema = z.object({
  receiverId: z.string().cuid('Invalid receiver ID'),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message cannot exceed 5000 characters'),
  attachments: z.array(z.string().url()).max(3, 'Maximum 3 attachments allowed').optional(),
})

// ============================================================================
// Subject Validation (Admin)
// ============================================================================

export const createSubjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').trim(),
  nameEn: z.string().min(2, 'English name must be at least 2 characters').max(100, 'English name cannot exceed 100 characters').trim(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  icon: z.string().max(100).optional(),
  category: z.string().min(2).max(50),
})

// ============================================================================
// User Update Validation (Admin)
// ============================================================================

export const updateUserSchema = z.object({
  role: z.enum(['STUDENT', 'TUTOR', 'ADMIN', 'PARENT']).optional(),
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  avatar: urlSchema.optional(),
})

// ============================================================================
// Pagination Validation
// ============================================================================

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// ============================================================================
// Helper Function: Validate and Parse
// ============================================================================

/**
 * Validates request body against schema and returns parsed data
 * Throws ZodError if validation fails
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Validates request body against schema and returns safe parse result
 * Does not throw, returns { success: true, data } or { success: false, error }
 */
export function safeValidateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data)
}
