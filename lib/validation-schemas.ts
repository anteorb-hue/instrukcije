/**
 * Zod Validation Schemas for API Input Validation
 *
 * Centralized validation to prevent:
 * - SQL injection (via Prisma + validation)
 * - XSS attacks (via input sanitization)
 * - Business logic violations
 * - Data integrity issues
 *
 * @module lib/validation-schemas
 * @example
 * ```typescript
 * import { passwordSchema, safeValidateRequest } from '@/lib/validation-schemas'
 *
 * // In your API route
 * const validation = safeValidateRequest(passwordSchema, userInput)
 * if (!validation.success) {
 *   return res.status(400).json({ error: validation.error })
 * }
 * ```
 */

import { z } from 'zod'

// ============================================================================
// Common Reusable Schemas
// ============================================================================

/**
 * Email validation schema
 * @description Validates email format and max length (255 chars)
 * @example
 * ```typescript
 * emailSchema.parse('user@example.com') // ✅ Valid
 * emailSchema.parse('invalid-email')    // ❌ Throws error
 * ```
 */
export const emailSchema = z.string().email('Invalid email format').max(255)

/**
 * Password validation schema with complexity requirements
 * @description Enforces strong password policy:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&* etc.)
 * @example
 * ```typescript
 * passwordSchema.parse('Test1234!')  // ✅ Valid
 * passwordSchema.parse('weak')       // ❌ Too short
 * passwordSchema.parse('NoNumbers!') // ❌ No numbers
 * ```
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')

/**
 * Name validation schema
 * @description Validates user/entity name:
 * - Min 2 characters
 * - Max 100 characters
 * - Automatically trims whitespace
 * @example
 * ```typescript
 * nameSchema.parse('  John Doe  ') // ✅ Returns 'John Doe'
 * nameSchema.parse('A')            // ❌ Too short
 * ```
 */
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100).trim()

/**
 * URL validation schema
 * @description Validates URL format and max length (2048 chars)
 * @example
 * ```typescript
 * urlSchema.parse('https://example.com')  // ✅ Valid
 * urlSchema.parse('not-a-url')            // ❌ Invalid format
 * ```
 */
export const urlSchema = z.string().url('Invalid URL format').max(2048)

/**
 * Phone number validation schema
 * @description Validates international phone number format:
 * - Optional + prefix
 * - 10-15 digits
 * - Optional field
 * @example
 * ```typescript
 * phoneSchema.parse('+385981234567')  // ✅ Valid
 * phoneSchema.parse('0981234567')     // ✅ Valid
 * phoneSchema.parse('123')            // ❌ Too short
 * ```
 */
export const phoneSchema = z
  .string()
  .regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number format')
  .optional()

// ============================================================================
// Booking Validation
// ============================================================================

/**
 * Booking creation schema
 * @description Validates booking request data:
 * - tutorId: CUID format tutor identifier
 * - subjectId: CUID format subject identifier
 * - scheduledAt: ISO 8601 datetime string
 * - duration: 15-480 minutes (15 min to 8 hours)
 * - videoProvider: ZOOM, GOOGLE_MEET, or MICROSOFT_TEAMS
 * - notes: Optional notes up to 1000 characters
 * @example
 * ```typescript
 * const bookingData = {
 *   tutorId: 'cuid1234567890',
 *   subjectId: 'cuid0987654321',
 *   scheduledAt: '2025-12-01T10:00:00Z',
 *   duration: 60,
 *   videoProvider: 'ZOOM',
 *   notes: 'Please prepare algebra materials'
 * }
 * createBookingSchema.parse(bookingData) // ✅ Valid
 * ```
 */
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

/**
 * Rating schema (1-5 stars)
 * @description Validates rating value between 1 and 5 (inclusive)
 * @example
 * ```typescript
 * ratingSchema.parse(5)    // ✅ Valid
 * ratingSchema.parse(0)    // ❌ Too low
 * ratingSchema.parse(3.5)  // ❌ Must be integer
 * ```
 */
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

/**
 * Homework question creation schema
 * @description Validates homework question request:
 * - title: 5-200 characters, trimmed
 * - description: 10-5000 characters (question details)
 * - attachments: Optional array of URLs (max 5)
 * - subjectId: Optional CUID format subject identifier
 * - educationLevel: Optional education level enum
 * - tags: Optional array of tags (max 10, 50 chars each)
 * - assignedTutorId: Optional CUID for direct tutor assignment
 * @example
 * ```typescript
 * const homeworkData = {
 *   title: 'Help with quadratic equations',
 *   description: 'I need help solving x^2 + 5x + 6 = 0',
 *   subjectId: 'cuid1234567890',
 *   educationLevel: 'SREDNJA_SKOLA',
 *   tags: ['algebra', 'equations']
 * }
 * createHomeworkSchema.parse(homeworkData) // ✅ Valid
 * ```
 */
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

/**
 * Message creation schema
 * @description Validates direct message between users:
 * - receiverId: CUID format user identifier
 * - content: 1-5000 characters message content
 * - attachments: Optional array of file URLs (max 3)
 * @example
 * ```typescript
 * const messageData = {
 *   receiverId: 'cuid1234567890',
 *   content: 'When is our next session?',
 *   attachments: ['https://example.com/schedule.pdf']
 * }
 * createMessageSchema.parse(messageData) // ✅ Valid
 * ```
 */
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
// Auth Validation
// ============================================================================

/**
 * User registration schema
 * @description Validates new user registration data:
 * - name: 2-100 characters, trimmed (uses nameSchema)
 * - email: Valid email format, max 255 chars (uses emailSchema)
 * - password: Strong password requirements (uses passwordSchema):
 *   * Min 8 characters, uppercase, lowercase, number, special char
 * - role: STUDENT, TUTOR, or PARENT (ADMIN not allowed via registration)
 * - referralCode: Optional referral code (max 20 chars)
 * @example
 * ```typescript
 * const userData = {
 *   name: 'Ivan Horvat',
 *   email: 'ivan@example.com',
 *   password: 'Test1234!',
 *   role: 'STUDENT',
 *   referralCode: 'REF123'
 * }
 * registrationSchema.parse(userData) // ✅ Valid
 * ```
 */
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['STUDENT', 'TUTOR', 'PARENT']),
  referralCode: z.string().max(20).optional(),
})

/**
 * User login schema
 * @description Validates user login credentials:
 * - email: Valid email format (uses emailSchema)
 * - password: Non-empty string (no complexity check on login)
 * @example
 * ```typescript
 * const loginData = {
 *   email: 'ivan@example.com',
 *   password: 'mypassword'
 * }
 * loginSchema.parse(loginData) // ✅ Valid
 * ```
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// ============================================================================
// Helper Functions: Validate and Parse
// ============================================================================

/**
 * Validates request data against a Zod schema and returns parsed/typed data
 * @template T - The TypeScript type of the validated data
 * @param {z.ZodSchema<T>} schema - Zod schema to validate against
 * @param {unknown} data - Raw data to validate (typically from req.json() or req.body)
 * @returns {T} Parsed and type-safe data
 * @throws {z.ZodError} If validation fails, throws detailed error with field-level messages
 * @example
 * ```typescript
 * // In your API route
 * try {
 *   const validData = validateRequest(createBookingSchema, await req.json())
 *   // validData is now type-safe and validated
 *   await createBooking(validData)
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     return res.status(400).json({ errors: error.errors })
 *   }
 * }
 * ```
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Safely validates request data against a Zod schema without throwing
 * @template T - The TypeScript type of the validated data
 * @param {z.ZodSchema<T>} schema - Zod schema to validate against
 * @param {unknown} data - Raw data to validate (typically from req.json() or req.body)
 * @returns {z.SafeParseReturnType<unknown, T>} Result object with success flag
 *   - If valid: { success: true, data: T }
 *   - If invalid: { success: false, error: ZodError }
 * @example
 * ```typescript
 * // In your API route - Preferred for API endpoints
 * const validation = safeValidateRequest(createBookingSchema, await req.json())
 * if (!validation.success) {
 *   return res.status(400).json({
 *     error: 'Validation failed',
 *     details: validation.error.errors.map(e => ({
 *       field: e.path.join('.'),
 *       message: e.message
 *     }))
 *   })
 * }
 * // Use validation.data (type-safe)
 * await createBooking(validation.data)
 * ```
 */
export function safeValidateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data)
}
