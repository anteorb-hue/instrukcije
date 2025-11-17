# 🔐 Test Kredencijali - Instrukcije.hr

Ovo su test kredencijali za različite uloge u platformi. Svi passwordi su **identični za testiranje**: `test123`

---

## 👤 Korisničke Uloge

### 1. **ADMIN** - Superadministrator
```
Username: admin@instrukcije.hr
Password: test123
Role: ADMIN
```

**Pristup:**
- ✅ Admin Dashboard (`/admin`)
- ✅ User Management (`/admin/users`)
- ✅ Analytics & Reports
- ✅ System Settings
- ✅ Forum Moderacija
- ✅ Kreiranje grupnih lekcija
- ✅ Sve ostale funkcionalnosti

---

### 2. **TUTOR** - Instruktor
```
Username: ana.horvat@instrukcije.hr
Password: test123
Role: TUTOR
```

**Pristup:**
- ✅ Tutor Dashboard (`/dashboard`)
- ✅ Kreiranje grupnih lekcija (`/group-lessons/create`)
- ✅ Upravljanje rasporedom
- ✅ Review管理
- ✅ Earnings pregled
- ✅ Poruke sa učenicima
- ❌ Admin panel

**Drugi tutori za testiranje:**
```
marko.novak@instrukcije.hr - Fizika instruktor
petra.kovac@instrukcije.hr - Engleski jezik instruktor
ivan.babic@instrukcije.hr - Kemija instruktor
lucija.maric@instrukcije.hr - Programiranje instruktor
```

---

### 3. **STUDENT** - Učenik
```
Username: marko.maric@instrukcije.hr
Password: test123
Role: STUDENT
```

**Pristup:**
- ✅ Browse instruktori (`/search`)
- ✅ Booking lekcija
- ✅ Learning Paths
- ✅ Study Rooms
- ✅ Forum
- ✅ Homework Help
- ❌ Kreiranje grupnih lekcija
- ❌ Admin panel

**Drugi učenici za testiranje:**
```
ivana.simic@instrukcije.hr
tomislav.petrovic@instrukcije.hr
marija.juric@instrukcije.hr
```

---

### 4. **PARENT** - Roditelj
```
Username: parent@instrukcije.hr
Password: test123
Role: PARENT
```

**Pristup:**
- ✅ Parent Portal (`/parent-portal`)
- ✅ Praćenje napretka djece
- ✅ Payment history
- ✅ Activity timeline
- ✅ Booking za djecu
- ❌ Direktan pristup učeničkim funkcijama

**Djeca u accountu:**
- Marko (15 god) - Matematika, Fizika, Engleski
- Petra (13 god) - Hrvatski, Kemija, Biologija

---

## 🔗 Test URL-ovi

### Javne stranice (bez logina)
```
Početna:                   http://localhost:3000
Browse Tutori:             http://localhost:3000/search
Tutor Profil:              http://localhost:3000/tutors/1
Grupne Lekcije:            http://localhost:3000/group-lessons
Forum:                     http://localhost:3000/forum
```

### Autentificirane stranice
```
Dashboard:                 http://localhost:3000/dashboard
Bookings:                  http://localhost:3000/bookings
Learning Paths:            http://localhost:3000/learning-paths
Study Rooms:               http://localhost:3000/study-rooms
Parent Portal:             http://localhost:3000/parent-portal
Homework Help:             http://localhost:3000/homework-help
```

### Admin stranice (samo ADMIN)
```
Admin Dashboard:           http://localhost:3000/admin
User Management:           http://localhost:3000/admin/users
User Activity:             http://localhost:3000/admin/users/1/activity
```

---

## 🧪 Test Scenariji

### Scenario 1: Booking Online Lekcija
1. Login kao **STUDENT** (`marko.maric@instrukcije.hr`)
2. Idi na `/tutors/1` (Ana Horvat - Matematika)
3. Klikni "Zakaži termin"
4. Odaberi **Online**
5. Odaberi datum iz kalendara
6. Odaberi vrijeme
7. Odaberi predmet: Matematika
8. Odaberi video platformu: Zoom
9. Potvrdi rezervaciju

### Scenario 2: Booking Uživo Lekcija
1. Login kao **STUDENT**
2. Idi na `/tutors/2` (Marko Novak - Fizika)
3. Klikni "Zakaži termin"
4. Odaberi **Uživo**
5. Odaberi datum i vrijeme
6. **Upiši lokaciju** (obavezno!): "Kavana Central, Zagreb"
7. Potvrdi rezervaciju

### Scenario 3: Kreiranje Grupne Lekcije (samo TUTOR)
1. Login kao **TUTOR** (`ana.horvat@instrukcije.hr`)
2. Idi na `/group-lessons`
3. Klikni "Kreiraj grupnu lekciju" (vidljivo samo tutorima!)
4. Ispuni formu
5. Objavi

### Scenario 4: Nova Diskusija u Forumu
1. Login kao bilo koji korisnik
2. Idi na `/forum`
3. Klikni "Nova diskusija"
4. Ispuni:
   - Naslov: "Kako riješiti kvadratnu jednadžbu?"
   - Kategorija: Matematika
   - Opis: Detaljno pitanje...
   - Tagovi: algebra, kvadratne-jednadžbe
5. Objavi

### Scenario 5: Admin User Management
1. Login kao **ADMIN** (`admin@instrukcije.hr`)
2. Idi na `/admin/users`
3. Search "Ana" → pronađi Ana Horvat
4. Filter po ulozi: TUTOR
5. Klikni "View Details" → vidi modal
6. Klikni "View Activity" → timeline

---

## 📊 Mock Podaci

### Tutori (15 instruktora)
- Ana Horvat - Matematika - 4.9⭐ - 30 EUR/h
- Marko Novak - Fizika - 4.8⭐ - 35 EUR/h
- Petra Kovačić - Engleski - 5.0⭐ - 40 EUR/h
- Ivan Babić - Kemija - 4.7⭐ - 32 EUR/h
- Lucija Marić - Programiranje - 4.8⭐ - 45 EUR/h
- ... (još 10 instruktora)

### Grupne Lekcije (4 aktivne)
- Priprema za maturu - Matematika (12/15 mjesta)
- React za početnike - Webinar (25/30 mjesta)
- Engleski konverzacija (7/10 mjesta)
- Organska kemija - Priprema (5/12 mjesta)

### Forum Kategorije (15 kategorija)
1. 📐 Matematika (234)
2. ⚛️ Fizika (156)
3. 🧪 Kemija (98)
4. 🧬 Biologija (87)
5. 🇬🇧 Engleski jezik (189)
6. 🇭🇷 Hrvatski jezik (124)
7. 🇩🇪 Njemački jezik (76)
8. 💻 Programiranje (312)
9. 🌐 Web Development (145)
10. 📊 Data Science (93)
11. 🏛️ Povijest (65)
12. 🌍 Geografija (58)
13. 💼 Ekonomija (102)
14. 🧠 Psihologija (89)
15. 📚 Ostalo (145)

### Admin Users (50 mock korisnika)
- Search po imenu/emailu radi
- Filter po ulozi: Admin (2), Tutor (18), Student (25), Parent (5)
- Filter po statusu: Active (43), Suspended (4), Banned (2), Pending (1)

---

## 🔧 Posebne Napomene

### Grupne Lekcije
- **STUDENT** i **PARENT** **NE VIDE** dugme "Kreiraj grupnu lekciju"
- Samo **TUTOR** i **ADMIN** mogu kreirati grupne lekcije
- Mock user u `/group-lessons/page.tsx` je postavljen na **STUDENT**
- Za testiranje kreacije, promijeni `role: 'STUDENT'` u `role: 'TUTOR'`

### Booking Kalendar
- Kalendar prikazuje dostupne termine prema rasporedu tutora
- Nedostupni dani su onemogućeni (sivi)
- Dostupni slotovi se prikazuju nakon odabira datuma
- **Online** sesija traži video platformu
- **Uživo** sesija traži lokaciju (obavezno polje)

### Forum
- "Nova diskusija" modal se otvara pri kliku
- Obavezna polja: Naslov, Kategorija, Opis
- Tagovi su opcioni (multiple select)
- Thread se dodaje u listu nakon kreiranja

### Admin Panel
- User Management: Pagination (10 po stranici, 50 ukupno)
- Activity Log: 10 različitih tipova aktivnosti
- Bulk actions: Checkbox select sa Verify/Suspend/Email

---

## 🐛 Poznati Bugovi (Popravljeni)

### ✅ FIXED: Split Undefined Error
**Problem:** `Cannot read properties of undefined (reading 'split')`
**Lokacija:** `/tutors/[id]` - Booking kalendar
**Fix:** Dodano optional chaining `a.slots?.[0]?.split('-')?.[0]`

### ✅ FIXED: Grupne Lekcije Vidljive Svima
**Problem:** "Kreiraj grupnu lekciju" dugme vidljivo svim korisnicima
**Fix:** Dodano `canCreateGroupLesson` check (samo TUTOR/ADMIN)

---

## 📞 Support

Ako naiđete na probleme:
1. Provjerite da li koristite točan username/password
2. Provjerite da li je server pokrenut (`npm run dev`)
3. Provjerite konzolu za greške (F12)
4. Osvježite stranicu (Ctrl+R)

---

**Zadnje ažurirano:** 2025-01-17
**Version:** 1.0.0
**Build:** Development
