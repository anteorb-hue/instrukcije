# 🗄️ Database Setup Guide

## Network Issue sa Prisma Binaries

Trenutno postoji network restriction koji sprječava preuzimanje Prisma engine binaries (403 Forbidden). 
Migracije se moraju pokrenuti u okruženju sa pristupom internetu.

## 📋 Setup Steps

### 1. Environment Variables

Kopiraj `.env.example` u `.env` i popuni vrijednosti:

```bash
cp .env.example .env
```

**Obavezne environment varijable:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret key za NextAuth
- `RESEND_API_KEY` - Za email notifikacije (optional)
- `CLOUDINARY_*` - Za file uploads (optional)

### 2. Database Setup

```bash
# Kreiraj PostgreSQL bazu
createdb instrukcije

# Ili putem psql
psql -U postgres -c "CREATE DATABASE instrukcije;"
```

### 3. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Ili reset cijele baze i primijeni sve migracije
npx prisma migrate reset
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

## 🔧 Troubleshooting

### Prisma Engine Download Error (403 Forbidden)

Ako dobiješ `403 Forbidden` error pri preuzimanju Prisma engines:

```bash
# Dodaj u .env
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Pokušaj ponovo
npx prisma generate
```

### Database Connection Error

Provjeri:
1. Je li PostgreSQL pokrenut?
2. Je li DATABASE_URL ispravan?
3. Postoji li baza podataka?

```bash
# Test connection
npx prisma db pull

# View database
npx prisma studio
```

## 📊 Database Schema Overview

### Core Models
- User, TutorProfile, StudentProfile, ParentProfile
- Subject, SubjectTaught, Availability
- Booking, Payment, Review
- Message, Notification, Favorite

### Rewards System
- UserPoints, PointTransaction, UserReward
- RewardCatalog

### Learning Materials (Added)
- Material, MaterialTag
- MaterialView, MaterialDownload

### Tests & Quizzes (Added)
- Test, Question, QuestionOption
- TestQuestion, TestSubmission, SubmissionAnswer

### Homework Help (Added)
- HomeworkQuestion, HomeworkAnswer
- AnswerVote

## 🚀 Quick Start (When Network is Available)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Setup database
createdb instrukcije

# 4. Run migrations
npx prisma migrate dev

# 5. Generate client
npx prisma generate

# 6. Seed database (optional)
npm run db:seed

# 7. Start development server
npm run dev
```

## 📝 Migration Files

Sve migracije su spremljene u `prisma/migrations/` direktoriju.
Trenutno schema uključuje:
- Osnovne modele (User, Booking, etc.)
- Materials sistem
- Tests & Quizzes sistem
- Homework Help Q&A sistem
- Sve potrebne indekse i relacije

## ⚠️ Important Notes

- Prisma zahtijeva pristup internetu za download engine binaries pri prvom pokretanju
- Nakon što se binaries preuzmu, mogu se cachirati i koristiti offline
- U production okruženju, koristiti `npx prisma migrate deploy` umjesto `migrate dev`

---

Kada network problem bude riješen, jednostavno pokreni:
```bash
npx prisma generate && npx prisma migrate dev
```
