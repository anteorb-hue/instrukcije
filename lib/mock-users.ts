/**
 * Mock users for development/testing without database
 * Password for all users: "password123"
 * Hashed using bcryptjs with salt rounds 10
 */

export const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@instrukcije.hr',
    // Password: password123
    password: '$2a$10$XlngDfLOWCJLabZ1z6D9Zeex43VJvzsnpLbIrFuJHamrPOXGbjS3.',
    name: 'Admin User',
    role: 'ADMIN' as const,
    avatar: null,
    phone: '+385 91 234 5678',
    bio: 'Administrator korisnik',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tutor-1',
    email: 'instruktor@instrukcije.hr',
    password: '$2a$10$XlngDfLOWCJLabZ1z6D9Zeex43VJvzsnpLbIrFuJHamrPOXGbjS3.',
    name: 'Marko Horvat',
    role: 'TUTOR' as const,
    avatar: null,
    phone: '+385 91 234 5679',
    bio: 'Iskusni matematički instruktor',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'student-1',
    email: 'ucenik@instrukcije.hr',
    password: '$2a$10$XlngDfLOWCJLabZ1z6D9Zeex43VJvzsnpLbIrFuJHamrPOXGbjS3.',
    name: 'Ana Kovač',
    role: 'STUDENT' as const,
    avatar: null,
    phone: '+385 91 234 5680',
    bio: 'Student matematike',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

/**
 * For testing purposes, you can use these credentials:
 *
 * Admin:
 * - Email: admin@instrukcije.hr
 * - Password: password123
 *
 * Tutor:
 * - Email: instruktor@instrukcije.hr
 * - Password: password123
 *
 * Student:
 * - Email: ucenik@instrukcije.hr
 * - Password: password123
 */
