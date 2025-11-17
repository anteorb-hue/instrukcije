# 🚫 No-Show Penalty Sistem

## 📋 Pregled

No-show sistem automatski primjenjuje **-50 bodova penalty** na korisnika koji se nije pojavio na zakazanoj instrukciji. Ovo motivira korisnike da poštuju svoje obveze i ne uzrokuju gubitak vremena drugoj strani.

---

## 🔧 Kako funkcionira

### 1. **No-Show Statusi**

Postoje 2 nova statusa za bookinge:

```typescript
enum SessionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW_TUTOR    // Instruktor se nije pojavio
  NO_SHOW_STUDENT  // Učenik se nije pojavio
}
```

### 2. **Automatski Penalty**

Kada se booking označi kao `NO_SHOW_TUTOR` ili `NO_SHOW_STUDENT`:

```typescript
// U app/api/bookings/[id]/route.ts

if (status === 'NO_SHOW_TUTOR') {
  // Instruktoru se oduzima -50 bodova
  await applyPenalty(tutorId, 'NO_SHOW', ...)
}

if (status === 'NO_SHOW_STUDENT') {
  // Učeniku se oduzima -50 bodova
  await applyPenalty(studentId, 'NO_SHOW', ...)
}
```

**Rezultat:**
- ❌ **-50 bodova** za korisnika koji se nije pojavio
- 📧 **Notifikacija** za drugu stranu
- 📊 **Povijest** u point transactions

---

## 🎨 UI Komponente

### 1. **NoShowButton**

Komponenta za prijavljivanje no-show:

```tsx
import NoShowButton from '@/components/bookings/NoShowButton'

<NoShowButton
  bookingId={booking.id}
  currentStatus={booking.status}
  userRole={currentUser.role} // 'TUTOR' ili 'STUDENT'
  onSuccess={() => refreshBookings()}
/>
```

**Features:**
- ✅ Confirmation modal sa warning
- ✅ Automatski određuje tko je kriv (druga strana)
- ✅ Disabled za završene/otkazane sesije
- ✅ Loading state

**Izgled:**
```
┌─────────────────────────────┐
│ ⚠️  Prijavi No-Show          │
└─────────────────────────────┘
     ↓ klik
┌─────────────────────────────────────────┐
│  🔴  Prijavi No-Show                    │
│                                         │
│  Jeste li sigurni da učenik nije došao │
│  na instrukciju? Učenik će dobiti -50  │
│  bodova penala.                         │
│                                         │
│  ⚠️ Ova akcija je ozbiljna i ne može   │
│     se poništiti.                       │
│                                         │
│  [Odustani]  [Prijavi No-Show]         │
└─────────────────────────────────────────┘
```

### 2. **BookingStatusBadge**

Prikazuje status bookinga sa ikonom:

```tsx
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge'

<BookingStatusBadge status={booking.status} />
```

**Prikaz:**
- 📅 **Zakazano** - Plavi badge
- ▶️ **U tijeku** - Purple badge
- ✅ **Završeno** - Zeleni badge
- ❌ **Otkazano** - Sivi badge
- 🚫 **No-Show Instruktor** - Crveni badge
- 🚫 **No-Show Učenik** - Crveni badge

---

## 📊 Workflow Primjer

### Scenario: Učenik se nije pojavio

1. **Instruktor čeka** na Zoom linku u dogovoreno vrijeme
2. **Učenik ne dolazi** 10+ minuta
3. **Instruktor klikne** "Prijavi No-Show" u booking listi
4. **Confirmation modal** se pojavljuje
5. **Instruktor potvrdi** → Status postaje `NO_SHOW_STUDENT`

**Automatski događa se:**
- ✅ Učenik dobiva **-50 bodova**
- ✅ Point transaction: "Učenik se nije pojavio na zakazanoj instrukciji"
- ✅ Instruktor dobiva notifikaciju
- ✅ Payment se refundira (ako je plaćeno)

---

## 🛡️ Zaštita od zloupotrebe

### 1. **Admin Review**

Admin može pregledati sve no-show prijave:

```sql
SELECT * FROM bookings
WHERE status IN ('NO_SHOW_TUTOR', 'NO_SHOW_STUDENT')
ORDER BY scheduledAt DESC
```

### 2. **Manual Override**

Admin može vratiti bodove ako je no-show prijavljen pogrešno:

```typescript
// U admin panelu
await addPoints(
  wronglyPenalizedUserId,
  50, // Vrati bodove
  'REFUND',
  'No-show penalty poništen - greška u prijavi'
)
```

### 3. **Repeat Offenders**

Korisnici sa > 3 no-show u mjesecu mogu biti:
- ⚠️ Privremeno suspendovani
- 🚫 Perma-banned (> 5 no-show)
- 📧 Kontaktirani od admin tima

---

## 📈 Statistike

Admin panel može pratiti:

```typescript
// No-show rate by user
const noShowRate = (noShowCount / totalBookings) * 100

// Top offenders
const repeatOffenders = await prisma.booking.groupBy({
  by: ['tutorId', 'studentId'],
  where: {
    status: { startsWith: 'NO_SHOW' }
  },
  _count: true,
  having: { _count: { gte: 3 } }
})
```

---

## 🔗 Integracija

### U Booking List komponenti:

```tsx
'use client'

import NoShowButton from '@/components/bookings/NoShowButton'
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge'

export default function BookingsList() {
  const { data: session } = useSession()

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          <BookingStatusBadge status={booking.status} />

          {/* Show no-show button only if user is involved */}
          {(booking.tutorId === session.user.id ||
            booking.studentId === session.user.id) && (
            <NoShowButton
              bookingId={booking.id}
              currentStatus={booking.status}
              userRole={session.user.role}
              onSuccess={() => fetchBookings()}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

### U Admin Panel:

```tsx
// Admin može označiti no-show za bilo koji booking
<select
  value={booking.status}
  onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
>
  <option value="SCHEDULED">Zakazano</option>
  <option value="COMPLETED">Završeno</option>
  <option value="CANCELLED">Otkazano</option>
  <option value="NO_SHOW_TUTOR">No-Show Instruktor</option>
  <option value="NO_SHOW_STUDENT">No-Show Učenik</option>
</select>
```

---

## 💡 Best Practices

1. **Grace Period**: Preporučuje se čekati 10-15 minuta prije prijavljivanja no-show
2. **Communication First**: Probati kontaktirati drugu stranu prije prijavljivanja
3. **Documentation**: Admin bi trebao imati context (poruke, logs) prije poništavanja penalty-a
4. **Appeals**: Korisnici mogu kontaktirati support ako smatraju da je no-show nepravedno prijavljen

---

## 📝 TODO - Buduće nadogradnje

- [ ] Automated no-show detection (ako niko ne označi sesiju kao completed nakon 1h)
- [ ] Email notifikacije za no-show
- [ ] Grace period (5 min buffer prije mogućnosti prijave)
- [ ] Dispute system (korisnik može osporiti no-show)
- [ ] Stats dashboard (no-show rate po korisniku)

---

**Verzija**: 1.0
**Datum**: 2025-01-17
**Author**: Instrukcije.hr Team
