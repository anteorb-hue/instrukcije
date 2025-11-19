# QUICK FIXES FOR CRITICAL SECURITY ISSUES

Copy-paste fixes for the 6 critical issues. Estimated time: 1 hour

---

## Fix #1: /api/favorites/route.ts - Add Session Auth (15 min)

**Replace ALL occurrences of:**
```typescript
const userId = 'mock-user-id' // Replace with actual auth
```

**With:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In all three functions (GET, POST, DELETE), add:
const session = await getServerSession(authOptions)
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const userId = session.user.id
```

**Complete Fixed File:**
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        user: {
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
            userPoints: true,
          },
        },
      },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvaćanju favorita' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const { tutorId } = await req.json()

    if (!tutorId) {
      return NextResponse.json(
        { error: 'tutorId je obavezan' },
        { status: 400 }
      )
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Instruktor je već u favoritima' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        tutorId,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Greška pri dodavanju favorita' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const { searchParams } = new URL(req.url)
    const tutorId = searchParams.get('tutorId')

    if (!tutorId) {
      return NextResponse.json(
        { error: 'tutorId je obavezan' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_tutorId: {
          userId,
          tutorId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Greška pri uklanjanju favorita' },
      { status: 500 }
    )
  }
}
```

---

## Fix #2: /api/homework/[id]/view/route.ts - Add Auth (10 min)

**Replace entire file with:**
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement rate limiting (one view per user per question per 5 minutes)
    // const cacheKey = `view:${session.user.id}:${params.id}`
    // const hasViewedRecently = await redis.get(cacheKey)
    // if (hasViewedRecently) {
    //   return NextResponse.json({ success: true }) // Already counted recently
    // }
    // await redis.setex(cacheKey, 300, '1') // 5 minutes

    await prisma.homeworkQuestion.update({
      where: { id: params.id },
      data: {
        viewCount: { increment: 1 },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track view' },
      { status: 500 }
    )
  }
}
```

---

## Fix #3: /api/homework/answers/[id]/vote/route.ts - Fix Auth (15 min)

**In POST function, replace:**
```typescript
const { userId, vote } = body
if (!userId || (vote !== 1 && vote !== -1)) {
```

**With:**
```typescript
const session = await getServerSession(authOptions)
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const { vote } = body
const userId = session.user.id

if (!vote || (vote !== 1 && vote !== -1)) {
```

**In DELETE function, replace:**
```typescript
const { searchParams } = new URL(req.url)
const userId = searchParams.get('userId')

if (!userId) {
  return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
}
```

**With:**
```typescript
const session = await getServerSession(authOptions)
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const userId = session.user.id
```

---

## Fix #4: /api/homework/route.ts POST - Add Auth (10 min)

**Add at the beginning of POST function:**
```typescript
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      attachments,
      subjectId,
      educationLevel,
      tags,
      assignedTutorId,
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const question = await prisma.homeworkQuestion.create({
      data: {
        studentId: session.user.id,  // Use session, not request body
        title,
        description,
        attachments: attachments || [],
        subjectId,
        educationLevel,
        tags: tags || [],
        assignedTutorId,
      },
      // ... rest of the code
```

---

## Fix #5: /api/subjects/route.ts POST - Add Admin Check (5 min)

**Change from:**
```typescript
export async function POST(req: Request) {
```

**To:**
```typescript
import { withAdmin } from '@/lib/auth-middleware'
import { NextRequest } from 'next/server'

export const POST = withAdmin(async (req: NextRequest, session) => {
```

**And at the end, change:**
```typescript
  }
}
```

**To:**
```typescript
  }
})
```

---

## Fix #6: /api/questions/route.ts POST - Add Auth (10 min)

**Add at the beginning of POST function:**
```typescript
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'TUTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Only tutors can create questions' }, { status: 403 })
    }

    const body = await req.json()
    const {
      questionText,
      type,
      points,
      options,
      correctAnswer,
      explanation,
      subjectId,
      educationLevel,
      difficulty,
      tags,
    } = body

    if (!questionText || !type) {
      return NextResponse.json(
        { error: 'Question text and type are required' },
        { status: 400 }
      )
    }

    // ... rest of validation ...

    const question = await prisma.question.create({
      data: {
        tutorId: session.user.id,  // Use session, not request body
        questionText,
        type,
        // ... rest of data
```

---

## Fix #7: Uncomment Delete Protection (2 min)

**File:** `/api/admin/users/[id]/route.ts`

**Lines 164-166, change from:**
```typescript
    // Optional: Prevent deletion if user has bookings
    // if (user._count.bookingsAsStudent > 0 || user._count.bookingsAsTutor > 0) {
    //   return NextResponse.json(
    //     { error: 'Cannot delete user with existing bookings' },
    //     { status: 400 }
    //   )
    // }
```

**To:**
```typescript
    // Prevent deletion if user has bookings
    if (user._count.bookingsAsStudent > 0 || user._count.bookingsAsTutor > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with existing bookings' },
        { status: 400 }
      )
    }
```

---

## IMPORTS NEEDED

Add these imports to the top of each file:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withAdmin } from '@/lib/auth-middleware'  // For subject/question POST
import { NextRequest } from 'next/server'  // For withAdmin decorator
```

---

## TESTING EACH FIX

After applying each fix, test:

```bash
# Fix #1: Favorites
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/favorites
# Should return 401

# Fix #2: View Tracking
curl -X POST http://localhost:3000/api/homework/xyz/view
# Should return 401

# Fix #3: Voting
curl -X POST http://localhost:3000/api/homework/answers/xyz/vote -d '{"userId":"fake","vote":1}'
# Should return 401

# Fix #4: Homework Creation
curl -X POST http://localhost:3000/api/homework \
  -d '{"studentId":"otherId","title":"test"}'
# Should return 401

# Fix #5: Subject Creation
curl -X POST http://localhost:3000/api/subjects \
  -d '{"name":"test","nameEn":"test","category":"test"}'
# Should return 401 (not authenticated)

# Fix #6: Question Creation
curl -X POST http://localhost:3000/api/questions \
  -d '{"tutorId":"otherId","questionText":"test","type":"MULTIPLE_CHOICE"}'
# Should return 401
```

---

## TIME ESTIMATE

- Fix #1: 15 min
- Fix #2: 10 min
- Fix #3: 15 min
- Fix #4: 10 min
- Fix #5: 5 min
- Fix #6: 10 min
- Fix #7: 2 min
- **Testing:** 15 min
- **TOTAL: ~1.5 hours**

After completing these 7 fixes, move on to the HIGH priority issues (authorization checks on homework/test endpoints).

