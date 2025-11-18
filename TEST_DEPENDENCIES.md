# Test Dependencies Installation

## Required Packages

Za pokretanje testova trebate instalirati sljedeće dev dependencies:

```bash
npm install -D vitest@latest \
  @vitest/ui@latest \
  @vitejs/plugin-react@latest \
  happy-dom@latest
```

## Package Versions

Preporučene verzije:
- `vitest`: ^1.0.0 ili novija
- `@vitest/ui`: ^1.0.0 ili novija
- `@vitejs/plugin-react`: ^4.0.0 ili novija
- `happy-dom`: ^12.0.0 ili novija

## Updated package.json Scripts

Dodajte sljedeće scriptove u `package.json`:

```json
{
  "scripts": {
    "dev": "node server.js",
    "dev:next": "next dev",
    "build": "next build",
    "start": "NODE_ENV=production node server.js",
    "start:next": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Installation Command

Jednostavna instalacija svih test dependencies:

```bash
npm install -D vitest @vitest/ui @vitejs/plugin-react happy-dom
```

## Verifikacija Instalacije

Nakon instalacije, provjerite da testovi rade:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Open test UI
npm run test:ui
```

## Što smo kreirali:

### Konfiguracija
- ✅ `vitest.config.ts` - Vitest konfiguracija
- ✅ `tests/setup.ts` - Test setup sa mockovima

### Testovi
- ✅ `tests/auth-middleware.test.ts` - Auth middleware (16 test cases)
- ✅ `tests/api/admin/users.test.ts` - Admin users API (12 test cases)
- ✅ `tests/api/materials.test.ts` - Materials API (8 test cases)

### Dokumentacija
- ✅ `TESTING.md` - Kompletna testing dokumentacija
- ✅ `TEST_DEPENDENCIES.md` - Ova datoteka

## Ukupno: 36+ test cases ✅

### Coverage области:
- Authentication & Authorization
- Admin API routes
- Public API routes
- Error handling
- Edge cases

## Sljedeći koraci nakon instalacije:

1. Instaliraj dependencies: `npm install -D vitest @vitest/ui @vitejs/plugin-react happy-dom`
2. Pokreni testove: `npm test`
3. Otvori UI: `npm run test:ui`
4. Provjeri coverage: `npm run test:coverage`

Happy testing! 🧪
