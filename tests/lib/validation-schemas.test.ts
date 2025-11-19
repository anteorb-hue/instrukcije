import { describe, it, expect } from 'vitest'
import {
  passwordSchema,
  emailSchema,
  nameSchema,
  registrationSchema,
  loginSchema,
  createBookingSchema,
  createMessageSchema,
  createHomeworkSchema,
  ratingSchema,
  updateUserSchema,
  validateRequest,
  safeValidateRequest,
} from '@/lib/validation-schemas'

describe('validation-schemas', () => {
  describe('passwordSchema', () => {
    it('should accept valid password', () => {
      const result = passwordSchema.safeParse('Test1234!')
      expect(result.success).toBe(true)
    })

    it('should reject password shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Test1!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject password without uppercase', () => {
      const result = passwordSchema.safeParse('test1234!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('uppercase letter')
      }
    })

    it('should reject password without lowercase', () => {
      const result = passwordSchema.safeParse('TEST1234!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('lowercase letter')
      }
    })

    it('should reject password without number', () => {
      const result = passwordSchema.safeParse('TestTest!')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('number')
      }
    })

    it('should reject password without special character', () => {
      const result = passwordSchema.safeParse('Test1234')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('special character')
      }
    })
  })

  describe('emailSchema', () => {
    it('should accept valid email', () => {
      const result = emailSchema.safeParse('test@example.com')
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse('invalid-email')
      expect(result.success).toBe(false)
    })

    it('should reject email without domain', () => {
      const result = emailSchema.safeParse('test@')
      expect(result.success).toBe(false)
    })

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@test.com'
      const result = emailSchema.safeParse(longEmail)
      expect(result.success).toBe(false)
    })
  })

  describe('nameSchema', () => {
    it('should accept valid name', () => {
      const result = nameSchema.safeParse('John Doe')
      expect(result.success).toBe(true)
    })

    it('should trim whitespace', () => {
      const result = nameSchema.safeParse('  John Doe  ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('John Doe')
      }
    })

    it('should reject name shorter than 2 characters', () => {
      const result = nameSchema.safeParse('J')
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 100 characters', () => {
      const result = nameSchema.safeParse('a'.repeat(101))
      expect(result.success).toBe(false)
    })
  })

  describe('registrationSchema', () => {
    it('should accept valid registration data', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test1234!',
        role: 'STUDENT',
      })
      expect(result.success).toBe(true)
    })

    it('should accept optional referralCode', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test1234!',
        role: 'STUDENT',
        referralCode: 'REF123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid role', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test1234!',
        role: 'ADMIN', // Not allowed in registration
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        // password missing
        role: 'STUDENT',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      })
      expect(result.success).toBe(true)
    })

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({
        password: 'anypassword',
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createBookingSchema', () => {
    it('should accept valid booking data', () => {
      const result = createBookingSchema.safeParse({
        tutorId: 'cuid1234567890123456',
        subjectId: 'cuid0987654321098765',
        scheduledAt: '2025-12-01T10:00:00Z',
        duration: 60,
        videoProvider: 'ZOOM',
      })
      expect(result.success).toBe(true)
    })

    it('should reject duration less than 15 minutes', () => {
      const result = createBookingSchema.safeParse({
        tutorId: 'cuid1234567890123456',
        subjectId: 'cuid0987654321098765',
        scheduledAt: '2025-12-01T10:00:00Z',
        duration: 10,
        videoProvider: 'ZOOM',
      })
      expect(result.success).toBe(false)
    })

    it('should reject duration more than 480 minutes', () => {
      const result = createBookingSchema.safeParse({
        tutorId: 'cuid1234567890123456',
        subjectId: 'cuid0987654321098765',
        scheduledAt: '2025-12-01T10:00:00Z',
        duration: 500,
        videoProvider: 'ZOOM',
      })
      expect(result.success).toBe(false)
    })

    it('should accept optional notes', () => {
      const result = createBookingSchema.safeParse({
        tutorId: 'cuid1234567890123456',
        subjectId: 'cuid0987654321098765',
        scheduledAt: '2025-12-01T10:00:00Z',
        duration: 60,
        videoProvider: 'GOOGLE_MEET',
        notes: 'Please prepare materials on algebra',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createMessageSchema', () => {
    it('should accept valid message data', () => {
      const result = createMessageSchema.safeParse({
        receiverId: 'cuid1234567890123456',
        content: 'Hello, when is the next session?',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty content', () => {
      const result = createMessageSchema.safeParse({
        receiverId: 'cuid1234567890123456',
        content: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject content longer than 5000 characters', () => {
      const result = createMessageSchema.safeParse({
        receiverId: 'cuid1234567890123456',
        content: 'a'.repeat(5001),
      })
      expect(result.success).toBe(false)
    })

    it('should accept optional attachments array', () => {
      const result = createMessageSchema.safeParse({
        receiverId: 'cuid1234567890123456',
        content: 'Check this file',
        attachments: ['https://example.com/file.pdf'],
      })
      expect(result.success).toBe(true)
    })

    it('should reject more than 3 attachments', () => {
      const result = createMessageSchema.safeParse({
        receiverId: 'cuid1234567890123456',
        content: 'Check these files',
        attachments: [
          'https://example.com/1.pdf',
          'https://example.com/2.pdf',
          'https://example.com/3.pdf',
          'https://example.com/4.pdf',
        ],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createHomeworkSchema', () => {
    it('should accept valid homework data', () => {
      const result = createHomeworkSchema.safeParse({
        title: 'Help with quadratic equations',
        description: 'I need help solving x^2 + 5x + 6 = 0',
        subjectId: 'cuid1234567890123456',
        educationLevel: 'SREDNJA_SKOLA',
      })
      expect(result.success).toBe(true)
    })

    it('should reject title shorter than 5 characters', () => {
      const result = createHomeworkSchema.safeParse({
        title: 'Help',
        description: 'I need help with math',
        subjectId: 'cuid1234567890123456',
      })
      expect(result.success).toBe(false)
    })

    it('should reject description shorter than 10 characters', () => {
      const result = createHomeworkSchema.safeParse({
        title: 'Math help needed',
        description: 'Help me',
        subjectId: 'cuid1234567890123456',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('ratingSchema', () => {
    it('should accept valid ratings 1-5', () => {
      for (let i = 1; i <= 5; i++) {
        const result = ratingSchema.safeParse(i)
        expect(result.success).toBe(true)
      }
    })

    it('should reject rating less than 1', () => {
      const result = ratingSchema.safeParse(0)
      expect(result.success).toBe(false)
    })

    it('should reject rating greater than 5', () => {
      const result = ratingSchema.safeParse(6)
      expect(result.success).toBe(false)
    })

    it('should reject non-integer rating', () => {
      const result = ratingSchema.safeParse(3.5)
      expect(result.success).toBe(false)
    })
  })

  describe('updateUserSchema', () => {
    it('should accept valid user update data', () => {
      const result = updateUserSchema.safeParse({
        name: 'John Updated',
        email: 'john.updated@example.com',
        bio: 'Updated bio',
      })
      expect(result.success).toBe(true)
    })

    it('should accept partial updates', () => {
      const result = updateUserSchema.safeParse({
        name: 'John Updated',
      })
      expect(result.success).toBe(true)
    })

    it('should accept role update', () => {
      const result = updateUserSchema.safeParse({
        role: 'TUTOR',
      })
      expect(result.success).toBe(true)
    })

    it('should reject bio longer than 1000 characters', () => {
      const result = updateUserSchema.safeParse({
        bio: 'a'.repeat(1001),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('helper functions', () => {
    describe('validateRequest', () => {
      it('should return parsed data for valid input', () => {
        const data = validateRequest(emailSchema, 'test@example.com')
        expect(data).toBe('test@example.com')
      })

      it('should throw error for invalid input', () => {
        expect(() => {
          validateRequest(emailSchema, 'invalid-email')
        }).toThrow()
      })
    })

    describe('safeValidateRequest', () => {
      it('should return success result for valid input', () => {
        const result = safeValidateRequest(emailSchema, 'test@example.com')
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe('test@example.com')
        }
      })

      it('should return error result for invalid input', () => {
        const result = safeValidateRequest(emailSchema, 'invalid-email')
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error).toBeDefined()
        }
      })
    })
  })
})
