# 🚀 Kompletni Vodič za Postavljanje i Testiranje

## 📋 Sadržaj

1. [Test Kredencijali](#test-kredencijali)
2. [Kako Radi Hibridna Autentikacija](#kako-radi-hibridna-autentikacija)
3. [Postavljanje PostgreSQL Baze](#postavljanje-postgresql-baze)
4. [Brzo Testiranje Bez Baze](#brzo-testiranje-bez-baze)
5. [Korisne Komande](#korisne-komande)

---

## 🔑 Test Kredencijali

Svi test korisnici koriste **istu lozinku**: `password123`

### Admin Pristup
```
Email: admin@instrukcije.hr
Lozinka: password123
Opis: Pun administratorski pristup
```

### Instruktor Pristup
```
Email: instruktor@instrukcije.hr
Lozinka: password123
Opis: Instruktor sa predmetima Matematika i Fizika
```

### Učenik Pristup
```
Email: ucenik@instrukcije.hr
Lozinka: password123
Opis: Studentski profil
```

---

## 🔄 Kako Radi Hibridna Autentikacija

Aplikacija koristi **pametnu hibridnu autentikaciju** koja automatski prelazi između režima:

### 1. **Produkcijski Režim** (sa bazom podataka)
```typescript
// lib/auth.ts - prvo pokušava koristiti Prisma
const user = await prisma.user.findUnique({
  where: { email: credentials.email },
  // ...
})
```

### 2. **Development Režim** (bez baze podataka)
```typescript
// Ako baza nije dostupna, automatski fallback na mock korisnike
catch (error) {
  console.warn('Database not available, using mock users')
  const user = mockUsers.find(u => u.email === credentials.email)
  // ...
}
```

### Prednosti:
✅ Radi odmah, čak i bez baze podataka
✅ Spremno za produkciju - samo pokreni PostgreSQL
✅ Isti test korisnici u oba režima
✅ Nema potrebe mijenjati kod kad postaviš bazu

---

## 🗄️ Postavljanje PostgreSQL Baze

### Opcija 1: Instalacija Lokalno

#### Windows

**Korak 1:** Preuzmi PostgreSQL
```powershell
# Preuzmi sa https://www.postgresql.org/download/windows/
# ili koristi Chocolatey:
choco install postgresql
```

**Korak 2:** Pokreni PostgreSQL
```powershell
# PostgreSQL automatski pokreće service prilikom instalacije
# Provjeri status u Services (services.msc)
```

**Korak 3:** Kreiraj bazu
```powershell
# Otvori Command Prompt kao Administrator
psql -U postgres

# U psql konzoli:
CREATE DATABASE instrukcije;
CREATE USER instrukcije_user WITH ENCRYPTED PASSWORD 'instrukcije123';
GRANT ALL PRIVILEGES ON DATABASE instrukcije TO instrukcije_user;
ALTER DATABASE instrukcije OWNER TO instrukcije_user;
\q
```

#### macOS

```bash
# Instalacija
brew install postgresql@15
brew services start postgresql@15

# Kreiranje baze
psql postgres
CREATE DATABASE instrukcije;
CREATE USER instrukcije_user WITH ENCRYPTED PASSWORD 'instrukcije123';
GRANT ALL PRIVILEGES ON DATABASE instrukcije TO instrukcije_user;
\q
```

#### Linux (Ubuntu/Debian)

```bash
# Instalacija
sudo apt update
sudo apt install postgresql postgresql-contrib

# Pokretanje servisa
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Kreiranje baze
sudo -u postgres psql
CREATE DATABASE instrukcije;
CREATE USER instrukcije_user WITH ENCRYPTED PASSWORD 'instrukcije123';
GRANT ALL PRIVILEGES ON DATABASE instrukcije TO instrukcije_user;
\q
```

### Opcija 2: Docker (Najlakše!)

```bash
# Pokreni PostgreSQL u Docker containeru
docker run --name instrukcije-postgres \
  -e POSTGRES_DB=instrukcije \
  -e POSTGRES_USER=instrukcije_user \
  -e POSTGRES_PASSWORD=instrukcije123 \
  -p 5432:5432 \
  -d postgres:15

# Zaustavljanje
docker stop instrukcije-postgres

# Ponovno pokretanje
docker start instrukcije-postgres
```

---

## ⚙️ Konfiguracija i Migracija

### Korak 1: Provjeri .env datoteku

Datoteka `.env` je već kreirana u root folderu. Ažuriraj ako je potrebno:

```env
DATABASE_URL="postgresql://instrukcije_user:instrukcije123@localhost:5432/instrukcije"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
```

### Korak 2: Instaliraj Dependencies

```bash
npm install
```

### Korak 3: Pokreni Migracije

```bash
# Kreira tabele u bazi podataka
npm run db:migrate
```

Odgovori `y` na pitanja o imenu migracije (npr. "init").

### Korak 4: Popuni Bazu Podacima

```bash
# Automatski kreira test korisnike i predmete
npm run db:seed
```

Trebao bi vidjeti output:
```
🌱 Starting database seed...
✓ Created admin user: admin@instrukcije.hr
✓ Created tutor user: instruktor@instrukcije.hr
✓ Created student user: ucenik@instrukcije.hr
✓ Created subjects: 4
✓ Linked subjects to tutor
✓ Added tutor availability
🎉 Database seed completed!
```

### Korak 5: Pokreni Development Server

```bash
npm run dev
```

Aplikacija će biti dostupna na: http://localhost:3000

---

## ⚡ Brzo Testiranje Bez Baze

Ako ne želiš postavljati PostgreSQL odmah, aplikacija **i dalje radi**!

```bash
# Jednostavno pokreni development server
npm run dev
```

Autentikacija će automatski koristiti mock korisnike definirane u `lib/mock-users.ts`.

Prijaviti se možeš sa istim kredencijalima:
- `admin@instrukcije.hr / password123`
- `instruktor@instrukcije.hr / password123`
- `ucenik@instrukcije.hr / password123`

⚠️ **Napomena**: Bez baze, neki features neće raditi:
- Kreiranje novih korisnika
- Spremanje bookinga
- Perzistencija podataka
- API endpointi koji ovise o bazi

---

## 🛠️ Korisne Komande

### Development
```bash
npm run dev              # Pokreni development server
npm run build            # Build za production
npm run start            # Pokreni production server
npm run lint             # Pokreni ESLint
```

### Baza Podataka
```bash
npm run db:migrate       # Pokreni migracije (kreira tabele)
npm run db:seed          # Popuni bazu test podacima
npm run db:studio        # Otvori Prisma Studio (GUI za bazu)
npm run db:reset         # ⚠️ OPASNO: Resetuj bazu (briše sve!)
```

### Prisma Studio
```bash
npm run db:studio
```
Otvara GUI na http://localhost:5555 gdje možeš:
- Pregledati sve tabele
- Editovati podatke
- Dodavati nove zapise
- Brisati zapise

---

## 🧪 Testiranje Features

### 1. Testiranje Prijave

1. Idi na http://localhost:3000/login
2. Probaj prijaviti se sa:
   - `admin@instrukcije.hr / password123`
3. Trebao bi biti preusmjeren na admin dashboard

### 2. Testiranje Različitih Uloga

**Admin (`admin@instrukcije.hr`)**:
- Pristup admin panelu
- Upravljanje korisnicima
- Statistike platforme
- Moderiranje sadržaja

**Instruktor (`instruktor@instrukcije.hr`)**:
- Profil instruktora
- Upravljanje predmetima (Matematika, Fizika)
- Kalendar dostupnosti
- Pregled booking requests

**Učenik (`ucenik@instrukcije.hr`)**:
- Pretraga instruktora
- Booking sistema
- Poruke
- Moji bookings

### 3. Testiranje sa Bazom vs Bez Baze

**Sa bazom:**
```bash
# Provjeri da PostgreSQL radi
pg_isready -h localhost -p 5432

# Pokreni server
npm run dev

# U konzoli ćeš vidjeti Prisma upite ako je baza povezana
```

**Bez baze:**
```bash
# Zaustavi PostgreSQL (docker stop ili service stop)

# Pokreni server
npm run dev

# U konzoli ćeš vidjeti:
# "Database not available, using mock users"
```

---

## 📁 Struktura Datoteka

```
instrukcije/
├── lib/
│   ├── auth.ts              # Hibridna autentikacija (Prisma + Mock)
│   ├── mock-users.ts        # Mock korisnici za development
│   ├── prisma.ts            # Prisma client singleton
│   └── db.ts                # Database helper funkcije
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed skripta (test podaci)
│   └── migrations/          # Database migracije
├── .env                     # Environment varijable (nije u git-u)
├── .env.example             # Primjer .env datoteke
├── TEST-KREDENCIJALI.md     # Brzi vodič za kredencijale
└── docs/
    └── kompletni-test-kredencijale-dokument.md  # Ovaj dokument
```

---

## 🔍 Troubleshooting

### Problem: "Cannot connect to database"

**Rješenje 1**: Provjeri da PostgreSQL radi
```bash
# Windows
services.msc  # Traži "PostgreSQL"

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Docker
docker ps | grep postgres
```

**Rješenje 2**: Provjeri DATABASE_URL u .env
```env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://instrukcije_user:instrukcije123@localhost:5432/instrukcije"
```

### Problem: "Prisma Client not generated"

```bash
npx prisma generate
```

### Problem: "Migration failed"

```bash
# Reset baze i pokreni ispočetka
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Problem: "Port 3000 already in use"

```bash
# Zaustavi proces na portu 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: Autentikacija ne radi

1. Provjeri da Next.js server radi
2. Provjeri browser console za greške
3. Provjeri da NEXTAUTH_SECRET postoji u .env
4. Probaj clear cookies i refresh

---

## 📞 Dodatna Podrška

Ako imaš problema:

1. Provjeri da su sve dependencies instalirane: `npm install`
2. Provjeri da .env datoteka postoji i ima ispravne vrijednosti
3. Provjeri console output za error poruke
4. Probaj restart development servera

---

## ✅ Checklist za Production

Prije deploya u produkciju:

- [ ] Promijeni `NEXTAUTH_SECRET` u .env (koristi random string)
- [ ] Postavi pravi `DATABASE_URL` za produkcijsku bazu
- [ ] Pokreni `npm run db:migrate` na produkcijskoj bazi
- [ ] **NE** pokreni `npm run db:seed` u produkciji (osim ako trebaš test podatke)
- [ ] Omogući SSL za bazu podataka
- [ ] Postavi environment varijable na hosting platformi
- [ ] Testiraj prijavu u produkcijskom okruženju

---

**Verzija**: 1.0
**Zadnje ažurirano**: 2024
**Platforma**: Instrukcije.hr - Moderna platforma za online i uživo instrukcije
