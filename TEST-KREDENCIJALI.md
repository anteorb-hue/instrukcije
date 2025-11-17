# Test Kredencijali za Prijavu

Aplikacija trenutno koristi mock autentikaciju jer ne može pristupiti bazi podataka u ovom okruženju.

## Dostupni Korisnici

### Admin Pristup
- **Email**: admin@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Administrator sa punim pristupom svim funkcijama

### Instruktor Pristup
- **Email**: instruktor@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Instruktor profil

### Učenik Pristup
- **Email**: ucenik@instrukcije.hr
- **Lozinka**: password123
- **Opis**: Učenički profil

## Napomene

- Svi korisnici koriste istu lozinku: `password123`
- Mock korisnici su definirani u `lib/mock-users.ts`
- Autentikacija koristi NextAuth.js sa JWT strategijom
- Za production okruženje, potrebno je omogućiti Prisma i bazu podataka
