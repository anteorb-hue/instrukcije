# Test Kredencijali za Prijavu

## 🔑 Dostupni Korisnici

### Admin Pristup
- **Email**: admin@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Administrator sa punim pristupom svim funkcijama

### Instruktor Pristup
- **Email**: instruktor@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Instruktor profil sa predmetima Matematika i Fizika

### Učenik Pristup
- **Email**: ucenik@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Učenički profil

---

## 🚀 Postavljanje Baze Podataka (PostgreSQL)

Aplikacija koristi **hibridnu autentikaciju**:
- Prvo pokušava koristiti PostgreSQL bazu podataka
- Ako baza nije dostupna, automatski se prebacuje na mock korisnike
- Tako aplikacija radi i sa i bez baze!

### Koraci za postavljanje PostgreSQL baze:

#### 1. Instalacija PostgreSQL

**Windows:**
```powershell
# Preuzmi sa https://www.postgresql.org/download/windows/
# ili koristi Chocolatey:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Kreiranje Baze Podataka

```bash
# Prijaviti se kao postgres korisnik
sudo -u postgres psql

# U psql konzoli:
CREATE DATABASE instrukcije;
CREATE USER instrukcije_user WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE instrukcije TO instrukcije_user;
\q
```

#### 3. Konfiguracija .env

Datoteka `.env` je već kreirana. Ažuriraj `DATABASE_URL` ako je potrebno:

```env
DATABASE_URL="postgresql://instrukcije_user:your_password_here@localhost:5432/instrukcije"
```

#### 4. Pokretanje Migracija

```bash
# Pokreni Prisma migracije
npm run db:migrate

# Popuni bazu sa test podacima
npm run db:seed
```

#### 5. Provjera Baze (opciono)

```bash
# Otvori Prisma Studio za pregled podataka
npm run db:studio
```

---

## 📝 Napomene

- **Svi korisnici koriste istu lozinku**: `password123`
- **Mock korisnici** su definirani u `lib/mock-users.ts`
- **Seed podaci** su definirani u `prisma/seed.ts`
- **Autentikacija** koristi NextAuth.js sa JWT strategijom
- **Hibridni režim**: Aplikacija radi i bez baze podataka!

---

## 🛠️ Korisne Komande

```bash
# Pokretanje development servera
npm run dev

# Kreiranje nove migracije
npm run db:migrate

# Popunjavanje baze podacima
npm run db:seed

# Otvaranje Prisma Studio
npm run db:studio

# Reset baze podataka (OPASNO - briše sve!)
npm run db:reset
```
