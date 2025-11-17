# Rewards Sistem - Preostale funkcionalnosti

## ✅ Što je implementirano

### Automatsko nagrađivanje
- ✅ Završena instrukcija (10 bodova)
- ✅ Ocjene 5⭐ (+5), 4-4.9⭐ (+2), <3⭐ (-10)
- ✅ Detaljne recenzije 50+ riječi (+10)
- ✅ Kasno otkazivanje <24h (-20)
- ✅ Referral bonusi (100/50 bodova)

### API Endpoints
- ✅ GET /api/rewards/points - Dohvat bodova
- ✅ POST /api/rewards/redeem - Iskorištavanje nagrada
- ✅ GET /api/rewards/catalog - Katalog nagrada
- ✅ POST /api/rewards/use - Korištenje nagrada
- ✅ GET /api/rewards/history - Povijest transakcija
- ✅ GET/POST /api/rewards/referral - Referral sustav

### UI
- ✅ Rewards dashboard (/rewards)
- ✅ Referral kod input pri registraciji
- ✅ URL parametar ?ref=XXX podrška
- ✅ Real-time bodovi i tier prikaz

---

## ⏳ Što još treba dodati

### 1. Brza reakcija (<30min) - 3 boda
**Gdje:** Kada instruktor odgovori na upit/booking zahtjev

**Implementacija potrebna:**
```typescript
// U app/api/messages/route.ts ili booking route
const timeSinceInquiry = Date.now() - inquiry.createdAt.getTime()
const minutesSince = timeSinceInquiry / (1000 * 60)

if (minutesSince < 30) {
  await addPoints(
    tutorId,
    POINTS.FAST_RESPONSE,
    'EARNED',
    'Brza reakcija na upit (<30min)'
  )
}
```

### 2. Grupna instrukcija - 15 bodova
**Gdje:** Kod kreiranja/završavanja grupne instrukcije

**Potrebno:**
- Dodati `isGroup` flag u Booking model
- Dodati `participantCount` u Booking
- Modificirati rewardLessonCompletion()

```typescript
if (booking.isGroup) {
  const groupPoints = POINTS.GROUP_LESSON * (booking.participantCount || 1)
  await addPoints(tutorId, groupPoints, 'EARNED',
    `Grupna instrukcija (${booking.participantCount} učenika)`)
}
```

### 3. Dosljednost (10+ mjesečno) - 20 bodova
**Gdje:** Monthly cron job

**Implementacija:**
```typescript
// app/api/cron/monthly-bonuses/route.ts
export async function GET() {
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  // Find tutors with 10+ completed lessons last month
  const activeTutors = await prisma.booking.groupBy({
    by: ['tutorId'],
    where: {
      status: 'COMPLETED',
      completedAt: { gte: lastMonth }
    },
    _count: true,
    having: { _count: { gte: 10 } }
  })

  for (const tutor of activeTutors) {
    await addPoints(
      tutor.tutorId,
      POINTS.CONSISTENCY_BONUS,
      'BONUS',
      `Bonus za dosljednost (${tutor._count} instrukcija prošli mjesec)`
    )
  }
}
```

### 4. No-show detekcija - 50 bodova penala
**Gdje:** Kod booking statusa

**Potrebno:**
- Dodati `NO_SHOW` status u Booking
- Admin/Tutor može označiti no-show
- Automatski penal

```typescript
if (status === 'NO_SHOW') {
  await applyPenalty(
    booking.studentId, // ili tutorId ovisno tko nije došao
    'NO_SHOW',
    'Nepojavljivanje na zakazanoj instrukciji',
    { bookingId: booking.id }
  )
}
```

### 5. Loyalty bonusi za učenike
**Gdje:** Monthly/6-monthly/yearly cron jobs

- 5 instrukcija/mjesec → +25 bodova
- 10 instrukcija/mjesec → +75 bodova
- 6 mjeseci kontinuirano → +200 bodova
- 1 godina → +500 bodova

### 6. Rewards Catalog - Seed Data
**Gdje:** prisma/seed.ts

Trebamo seedati RewardCatalog tablicu s nagradama:

```typescript
const tutorRewards = [
  {
    type: 'COMMISSION_DISCOUNT',
    title: '5% Popust na proviziju',
    description: 'Smanjite proviziju za 1 mjesec',
    pointsCost: 500,
    value: 5,
    validDays: 30,
    userRole: 'TUTOR',
  },
  {
    type: 'COMMISSION_DISCOUNT',
    title: '10% Popust na proviziju',
    description: 'Smanjite proviziju za 1 mjesec',
    pointsCost: 1000,
    value: 10,
    validDays: 30,
    userRole: 'TUTOR',
  },
  {
    type: 'FEATURED',
    title: 'Featured Status',
    description: 'Budite istaknuti na homepage 7 dana',
    pointsCost: 2000,
    value: 1,
    validDays: 7,
    userRole: 'TUTOR',
  },
  {
    type: 'COMMISSION_DISCOUNT',
    title: '15% Popust na proviziju',
    description: 'Smanjite proviziju za 3 mjeseca',
    pointsCost: 5000,
    value: 15,
    validDays: 90,
    userRole: 'TUTOR',
  },
  {
    type: 'PREMIUM',
    title: 'Premium Profil',
    description: 'Besplatni premium profil na 6 mjeseci',
    pointsCost: 10000,
    value: 1,
    validDays: 180,
    userRole: 'TUTOR',
  },
]

const studentRewards = [
  {
    type: 'VOUCHER',
    title: '5 EUR Voucher',
    pointsCost: 100,
    value: 5,
    validDays: 30,
    userRole: 'STUDENT',
  },
  {
    type: 'VOUCHER',
    title: '10 EUR Voucher',
    pointsCost: 200,
    value: 10,
    validDays: 30,
    userRole: 'STUDENT',
  },
  {
    type: 'FREE_LESSON',
    title: 'Besplatna Instrukcija',
    description: 'Do 25 EUR vrijednosti',
    pointsCost: 500,
    value: 25,
    validDays: 60,
    userRole: 'STUDENT',
  },
  {
    type: 'VOUCHER',
    title: '30 EUR Voucher',
    pointsCost: 1000,
    value: 30,
    validDays: 30,
    userRole: 'STUDENT',
  },
]
```

### 7. Primjena nagrada
**Gdje:** Payment/Booking creation

Kada korisnik koristi nagradu, mora se aplicirati:

```typescript
// Kod kreiranja bookinga, check za active rewards
const activeVouchers = await prisma.userReward.findMany({
  where: {
    userPoints: { userId: session.user.id },
    used: false,
    type: 'VOUCHER',
    OR: [
      { expiresAt: null },
      { expiresAt: { gte: new Date() } }
    ]
  }
})

// Apply discount
let finalPrice = basePrice
if (selectedVoucher) {
  finalPrice -= selectedVoucher.value
  await useReward(selectedVoucher.id, session.user.id, bookingId)
}
```

### 8. Tier Benefits - Implementacija
**Gdje:** Tutors search algorithm

```typescript
// u app/tutors/page.tsx ili API
const getTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    include: {
      user: {
        include: {
          userPoints: true
        }
      }
    }
  })

  // Sort by tier boost
  tutors.sort((a, b) => {
    const tierBoostA = getTierVisibilityBoost(a.user.userPoints?.currentTier)
    const tierBoostB = getTierVisibilityBoost(b.user.userPoints?.currentTier)
    return tierBoostB - tierBoostA
  })
}

function getTierVisibilityBoost(tier: UserTier): number {
  switch(tier) {
    case 'ELITE': return 100
    case 'PLATINUM': return 50
    case 'GOLD': return 25
    case 'SILVER': return 10
    default: return 0
  }
}
```

### 9. Badges/Icons prikaz
**Gdje:** TutorCard, Profile

```typescript
// components/tutors/TutorCard.tsx
{tutor.userPoints?.currentTier === 'ELITE' && (
  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">
    ⭐ Elite
  </Badge>
)}
{tutor.userPoints?.currentTier === 'GOLD' && (
  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
    🥇 Gold
  </Badge>
)}
```

### 10. Email notifikacije
**Gdje:** Background jobs

- Čestitka za dostizanje novog tiera
- Podsjetnik za isteći nagrada
- Mjesečni izvještaj bodova
- Promocije nagrada

---

## 📊 Priority lista

### Visok prioritet (sada)
1. ✅ Seed RewardCatalog data
2. ✅ Tier badges u TutorCard
3. ✅ Primjena commission discount
4. ✅ Primjena voucher/free lesson

### Srednji prioritet (uskoro)
5. Brza reakcija tracking
6. No-show detekcija
7. Grupne instrukcije support

### Niži prioritet (kasnije)
8. Monthly cron jobs za bonuse
9. Loyalty bonusi
10. Email notifikacije

