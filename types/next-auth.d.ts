import 'next-auth'

declare module 'next-auth' {
  /**
   * Extended User type to include role
   */
  interface User {
    id: string
    email: string
    name: string
    role: 'STUDENT' | 'TUTOR' | 'ADMIN'
    avatar?: string
  }

  /**
   * Extended Session type to include user role
   */
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'STUDENT' | 'TUTOR' | 'ADMIN'
      avatar?: string
    }
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT type to include role
   */
  interface JWT {
    id: string
    role: 'STUDENT' | 'TUTOR' | 'ADMIN'
  }
}
