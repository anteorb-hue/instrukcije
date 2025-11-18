# 🚀 Instrukcije Platform - Setup Guide

## 📋 Što je novo implementirano

### ✅ Socket.io Real-time Messaging
- Custom Next.js server sa Socket.io integracijom
- Real-time messaging, typing indicators, read receipts
- Online/offline status tracking

### ✅ Email Notifications (Resend)
- Resend API integracija
- Email templates za booking confirmations, messages, reviews
- Graceful fallback ako API key nije konfiguriran

### ✅ Subject CRUD API
- GET /api/subjects - List svih predmeta
- GET /api/subjects/[id] - Pojedinačni predmet
- POST /api/subjects - Kreiranje novog predmeta (Admin)
- PUT /api/subjects/[id] - Ažuriranje predmeta (Admin)
- DELETE /api/subjects/[id] - Brisanje predmeta (Admin)

### ✅ Availability Management API
- GET /api/tutors/[id]/availability - Dohvaćanje dostupnosti
- POST /api/tutors/[id]/availability - Dodavanje slot-a
- PUT /api/tutors/[id]/availability - Bulk update (zamjena svih)
- DELETE /api/tutors/[id]/availability?slotId=xxx - Brisanje slot-a

---

## 🛠️ Inicijalni Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Kreiraj `.env` datoteku:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/instrukcije"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Payment Gateway)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (Email Service)
RESEND_API_KEY="re_..."
EMAIL_FROM="Instrukcije.hr <noreply@instrukcije.hr>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

---

## 🏃 Running the Application

### Development Mode

**Sa Socket.io (preporučeno):**
```bash
npm run dev
```

**Bez Socket.io (samo Next.js):**
```bash
npm run dev:next
```

### Production Mode

```bash
npm run build
npm start
```

---

## 📧 Resend Setup

1. Registriraj se na [resend.com](https://resend.com)
2. Kreiraj API key
3. Dodaj verified domain (ili koristi test mode sa `onboarding@resend.dev`)
4. Postavi `RESEND_API_KEY` u `.env`

**Napomena:** Bez API key-a, email-ovi se neće slati ali aplikacija će raditi normalno (logira se u console).

---

## 🔌 Socket.io Features

### Client-side Usage

Wrap app sa `SocketProvider`:

```tsx
import { SocketProvider } from '@/contexts/SocketContext'

function App() {
  return (
    <SocketProvider userId={session?.user?.id}>
      {children}
    </SocketProvider>
  )
}
```

### Using Socket.io in Components

```tsx
import { useSocket } from '@/contexts/SocketContext'

function MessagesPage() {
  const { socket, isConnected, sendMessage, joinConversation } = useSocket()

  useEffect(() => {
    if (isConnected) {
      joinConversation(conversationId)
    }

    socket?.on('new_message', (message) => {
      // Handle new message
    })

    socket?.on('user_typing', ({ userName }) => {
      // Show typing indicator
    })

    return () => {
      socket?.off('new_message')
      socket?.off('user_typing')
    }
  }, [isConnected, conversationId])

  const handleSend = () => {
    sendMessage({
      conversationId,
      senderId: user.id,
      receiverId: otherUser.id,
      content: message,
      senderName: user.name,
    })
  }
}
```

---

## 📚 API Documentation

### Subjects API

**List all subjects:**
```http
GET /api/subjects
Query params: ?category=Matematika&search=algebra
```

**Get single subject:**
```http
GET /api/subjects/:id
```

**Create subject (Admin):**
```http
POST /api/subjects
Body: { name, nameEn, description?, icon?, category }
```

**Update subject (Admin):**
```http
PUT /api/subjects/:id
Body: { name?, nameEn?, description?, icon?, category? }
```

**Delete subject (Admin):**
```http
DELETE /api/subjects/:id
```

### Availability API

**Get tutor availability:**
```http
GET /api/tutors/:userId/availability
```

**Add availability slot:**
```http
POST /api/tutors/:userId/availability
Body: { dayOfWeek: 0-6, startTime: "09:00", endTime: "12:00" }
```

**Bulk update (replace all):**
```http
PUT /api/tutors/:userId/availability
Body: { availability: [{ dayOfWeek, startTime, endTime }, ...] }
```

**Delete slot:**
```http
DELETE /api/tutors/:userId/availability?slotId=xxx
```

---

## 🔐 Authentication Required Endpoints

Većina API endpoint-a zahtijeva authentication. Koristi NextAuth session:

```typescript
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ... rest of code
}
```

---

## 🐛 Troubleshooting

### Socket.io ne radi

- Provjeri da pokrećeš `npm run dev` (ne `npm run dev:next`)
- Provjeri console za Socket.io connection errors
- Provjeri `NEXT_PUBLIC_APP_URL` u .env

### Email-ovi se ne šalju

- Provjeri `RESEND_API_KEY` u .env
- Provjeri da je domain verified na Resend
- Provjeri console - email service logira sve

### Database greške

- Provjeri `DATABASE_URL` u .env
- Pokreni `npx prisma migrate dev`
- Pokreni `npx prisma generate`

---

## 📊 Trenutni Status Feature-a

| Feature | Status | Notes |
|---------|--------|-------|
| Tutor Search | ✅ 95% | Potpuno funkcionalno |
| Booking System | ✅ 85% | Radi, treba video integration |
| Payments (Stripe) | ✅ 70% | Checkout radi, treba payout |
| Reviews | ✅ 90% | Potpuno funkcionalno |
| Messaging (REST) | ✅ 80% | Radi bez real-time |
| Messaging (Socket.io) | ✅ 100% | **NOVO - Real-time!** |
| Email Notifications | ✅ 100% | **NOVO - Resend integration!** |
| Subject Management | ✅ 100% | **NOVO - CRUD API!** |
| Availability Management | ✅ 100% | **NOVO - CRUD API!** |
| Rewards & Gamification | ✅ 85% | Backend kompletan |
| Parent Portal | ✅ 75% | Viewing radi |

---

## 🚧 Što Sljedeće?

### Sljedeći Prioriteti:

1. **Learning Materials** - Upload/management sistema
2. **Tests & Quizzes** - Kreiranje i rješavanje testova
3. **Homework Help** - Q&A sistem
4. **Admin Panel** - User management i analytics

---

## 📝 Notes

- Socket.io server koristi isti port kao Next.js (3000)
- Email service ima graceful fallback - logira u console ako nema API key-a
- Subject API je admin-only za POST/PUT/DELETE
- Availability API je tutor-only (validira userId)

---

## 🆘 Support

Za pitanja i probleme, otvori issue ili kontaktiraj tim.

Happy coding! 🚀
