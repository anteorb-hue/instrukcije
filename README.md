# Instrukcije.hr - Moderna Platforma za Online i Uživo Instrukcije

Najbolja platforma za povezivanje učenika sa instruktorima u Hrvatskoj. Podržava online predavanja putem Zoom, Google Meet i Microsoft Teams.

## 🚀 Glavne Funkcionalnosti

### Video Integracije
- ✅ **Zoom** - Automatsko kreiranje meeting linkova
- ✅ **Google Meet** - Google Calendar integracija
- ✅ **Microsoft Teams** - Teams meeting integracija

### Korisničke Funkcionalnosti
- 🔐 **Autentifikacija** - NextAuth sa email/password i social login
- 👤 **Profili** - Detaljni profili za instruktore i učenike
- 🔍 **Napredna Pretraga** - Filter po predmetu, cijeni, ocjeni, dostupnosti
- ⭐ **Review Sistem** - Ocjenjivanje i recenzije instruktora
- 💬 **Real-time Messaging** - Socket.io chat
- 📅 **Booking Sistem** - Automatsko zakazivanje sa kalendar sinkronizacijom
- 💳 **Plaćanja** - Stripe integracija za sigurna plaćanja

### Tehnička Stack

#### Frontend
- **Next.js 14** - React framework sa App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animacije
- **React Hook Form** - Form management
- **Zustand** - State management

#### Backend
- **Prisma** - ORM za PostgreSQL
- **NextAuth** - Authentication
- **Stripe** - Payment processing
- **Socket.io** - Real-time communication

#### Video Integracije
- Zoom API
- Google Calendar API (Google Meet)
- Microsoft Graph API (Teams)

## 📦 Instalacija

### Preduvjeti
- Node.js 18+
- PostgreSQL baza podataka
- Stripe račun
- Zoom, Google i Microsoft developer računi (za video integracije)

### Setup

1. **Klonirajte repozitorij**
```bash
git clone <repository-url>
cd instrukcije
```

2. **Instalirajte dependencije**
```bash
npm install
```

3. **Postavite environment varijable**
```bash
cp .env.example .env
```

Uredite `.env` sa svojim podacima:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/instrukcije"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Zoom
ZOOM_CLIENT_ID="your-zoom-client-id"
ZOOM_CLIENT_SECRET="your-zoom-client-secret"
ZOOM_ACCOUNT_ID="your-zoom-account-id"

# Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Microsoft
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
```

4. **Postavite bazu podataka**
```bash
npx prisma generate
npx prisma db push
```

5. **Pokrenite development server**
```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

## 🎨 Design Sistem

### Boje
- **Primary**: Plava (#0ea5e9)
- **Secondary**: Ljubičasta (#d946ef)
- **Success**: Zelena
- **Warning**: Žuta
- **Danger**: Crvena

### Komponente
- Button (primary, secondary, outline, ghost, danger)
- Input (sa labelama, error states, iconima)
- Card (hover efekti)
- Badge (različite varijante)
- Avatar (sa fallback inicijali)
- Modal (animirani)

## 📱 Responsivnost

Platforma je potpuno responsivna i optimizirana za:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🔒 Sigurnost

- Bcrypt za hashiranje lozinki
- CSRF zaštita
- Rate limiting
- Input validacija (Zod)
- SQL injection zaštita (Prisma)
- XSS zaštita

## 📊 Baza Podataka

### Modeli
- **User** - Korisnici (učenici i instruktori)
- **TutorProfile** - Detaljni profili instruktora
- **StudentProfile** - Profili učenika
- **Subject** - Predmeti
- **Booking** - Rezervacije termina
- **Payment** - Plaćanja
- **Review** - Recenzije
- **Message** - Poruke
- **Notification** - Notifikacije

## 🎯 Roadmap

### Faza 1 (Završeno)
- ✅ Dizajn sistema i komponente
- ✅ Autentifikacija
- ✅ Profili korisnika
- ✅ Pretraga i filtriranje
- ✅ Video integracije
- ✅ Booking sistem
- ✅ Payment integracija

### Faza 2 (Planirano)
- ⏳ Real-time messaging
- ⏳ Notifikacijski sistem
- ⏳ Email notifikacije
- ⏳ Dashboard i analytics
- ⏳ Mobile app (React Native)
- ⏳ AI-powered matching algoritam

### Faza 3 (Buduće)
- 📝 Interactive whiteboard
- 📝 Screen sharing
- 📝 File sharing
- 📝 Recording sesija
- 📝 Automated transcriptions
- 📝 Progress tracking

## 🤝 Doprinosi

Doprinosi su dobrodošli! Molimo pročitajte [CONTRIBUTING.md](CONTRIBUTING.md) za detalje.

## 📄 Licenca

Sva prava pridržana © 2025 Instrukcije.hr

## 📞 Kontakt

- Email: info@instrukcije.hr
- Website: https://instrukcije.hr
- Support: support@instrukcije.hr

## 🙏 Acknowledgments

Inspiracija od vodećih platformi:
- Preply - Najbolja platforma za jezike
- Superprof - Multi-subject pristup
- Wyzant - US marketplace model

---

**Made with ❤️ in Croatia**
