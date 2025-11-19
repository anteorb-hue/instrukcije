# Testing Guide

Ova mapa sadrži unit testove za Instrukcije platformu. Koristimo **Vitest** kao test framework zbog njegove brzine i kompatibilnosti sa modernim JavaScript/TypeScript ekosistemom.

## 🚀 Pokretanje Testova

### Osnovne komande

```bash
# Pokreni sve testove jednom
npm test

# Pokreni testove u watch modu (automatski reruns na promjene)
npm run test:watch

# Pokreni testove sa coverage izvještajem
npm run test:coverage

# Pokreni testove sa UI interfaceom (Vitest UI)
npm run test:ui
```

## 📁 Struktura Testova

```
tests/
├── README.md                           # Ovaj file
├── setup.ts                           # Global test setup
├── lib/                               # Library/utility testovi
│   ├── validation-schemas.test.ts     # Zod validation testovi
│   └── rate-limit.test.ts            # Rate limiting testovi
├── api/                               # API endpoint testovi
│   └── ...
└── components/                        # React component testovi
    └── ...
```

## 📝 Pisanje Testova

### Osnovni test template

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature name', () => {
  it('should do something', () => {
    const result = functionToTest()
    expect(result).toBe(expectedValue)
  })
})
```

### Best Practices

1. **Opisni nazivi**: Koristi describe() i it() da jasno opišeš što se testira
2. **AAA Pattern**: Arrange (pripremi), Act (izvrši), Assert (provjeri)
3. **Test jednu stvar**: Svaki test bi trebao testirati jedan aspekt funkcionalnosti
4. **Izolirani testovi**: Testovi ne bi trebali ovisiti jedan o drugom
5. **Mock eksterne dependencies**: Koristi vi.mock() za external dependencies

### Primjer dobrog testa

```typescript
describe('passwordSchema', () => {
  it('should reject password without uppercase letter', () => {
    // Arrange
    const invalidPassword = 'test1234!'

    // Act
    const result = passwordSchema.safeParse(invalidPassword)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('uppercase letter')
    }
  })
})
```

## 🎯 Coverage Ciljevi

Naš cilj je održavati minimalno:
- **60% Line Coverage** - Postotak linija koda koje su testirane
- **60% Function Coverage** - Postotak funkcija koje su testirane
- **60% Branch Coverage** - Postotak grana (if/else) koje su testirane
- **60% Statement Coverage** - Postotak statement-a koji su testirani

Možeš vidjeti trenutni coverage report pokretanjem:
```bash
npm run test:coverage
```

Coverage report će biti generiran u `coverage/` folderu.

## 🧪 Što se testira?

### ✅ Trenutno pokriveno

- **Validation Schemas** (`lib/validation-schemas.ts`)
  - Password validation sa complexity requirements
  - Email, name, URL validacija
  - Registration, login, booking schemas
  - Message, homework, rating schemas
  - Helper funkcije (validateRequest, safeValidateRequest)

- **Rate Limiting** (`lib/rate-limit.ts`)
  - Basic rate limiting funkcionalnost
  - Window reset behavior
  - Rate limit presets (STRICT, STANDARD, RELAXED, MESSAGES, AUTH)
  - Edge cases (concurrent requests, empty identifiers)
  - Performance testovi

### 🔜 Planirano za testiranje

- API endpoints (integration testovi)
- React komponente (unit i integration)
- Auth middleware
- Database utilities
- Query optimization helpers

## 🛠️ Alati

- **Vitest**: Test framework (brz, moderne API, TypeScript support)
- **@vitest/ui**: Web-based UI za pregledavanje testova
- **v8**: Coverage provider (brz i precizan)

## 📚 Dodatni resursi

- [Vitest Dokumentacija](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Vitest API Reference](https://vitest.dev/api/)

## 💡 Savjeti

1. **Piši testove prije ili odmah nakon pisanja koda** (TDD/Test-Driven Development)
2. **Koristi watch mode za brzi feedback loop** (`npm run test:watch`)
3. **Provjeri coverage periodično** da vidiš što je još netestirano
4. **Testiraj edge cases** - ne samo happy path
5. **Mock external API calls** - testovi bi trebali biti brzi i pouzdani

## ❓ Česta pitanja

**Q: Zašto Vitest umjesto Jest?**
A: Vitest je brži, ima native ESM support, TypeScript support out-of-the-box, i bolje se integrira sa Vite/Next.js ekosistemom.

**Q: Kako testirati async funkcije?**
A: Koristi `async/await` u testu ili vrati Promise. Vitest automatski čeka.

**Q: Kako mock-ati Prisma?**
A: Koristi `vi.mock('@/lib/prisma')` i definiraj mock funkcionalnost.

**Q: Kako skip-ati test?**
A: Koristi `it.skip()` ili `describe.skip()`.

---

Sretan testing! 🎉
