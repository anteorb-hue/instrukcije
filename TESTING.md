# Testing Guide

Ovaj projekt koristi **Vitest** za unit i integration testove.

## Setup

### 1. Instaliraj dependencies

```bash
npm install -D vitest @vitest/ui @vitejs/plugin-react happy-dom
```

### 2. Package.json scripts

Dodaj sljedeće scriptove u `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Pokretanje testova

### Razvoj (watch mode)
```bash
npm test
```

### Jedan run (CI/CD)
```bash
npm run test:run
```

### Sa UI interface-om
```bash
npm run test:ui
```

### Sa coverage report-om
```bash
npm run test:coverage
```

## Struktura testova

```
tests/
├── setup.ts                    # Test setup i mockovi
├── auth-middleware.test.ts     # Auth middleware testovi
├── api/
│   ├── admin/
│   │   └── users.test.ts      # Admin users API testovi
│   └── materials.test.ts       # Materials API testovi
```

## Написани testovi

### ✅ Auth Middleware (`tests/auth-middleware.test.ts`)
- `requireAuth()` - autentifikacija korisnika
- `requireAdmin()` - provjera ADMIN role
- `requireRole()` - provjera specifičnih rola
- `requireTutor()` - provjera TUTOR/ADMIN role
- `requireOwnership()` - provjera vlasništva nad resursom
- `withAuth()` wrapper - zaštita API ruta
- `withAdmin()` wrapper - zaštita admin ruta
- `withTutor()` wrapper - zaštita tutor ruta
- `withRole()` wrapper - zaštita ruta po rolama

**Coverage:**
- ✅ Authenticated users
- ✅ Unauthenticated users (401)
- ✅ Unauthorized users (403)
- ✅ Role-based access control
- ✅ Resource ownership verification

### ✅ Admin Users API (`tests/api/admin/users.test.ts`)
- `GET /api/admin/users` - lista svih korisnika
- `GET /api/admin/users/[id]` - detalji korisnika
- `PUT /api/admin/users/[id]` - ažuriranje korisnika
- `DELETE /api/admin/users/[id]` - brisanje korisnika

**Test cases:**
- ✅ Auth/authorization checks (401/403)
- ✅ Successful operations (200)
- ✅ Not found errors (404)
- ✅ Filtering (role, search)
- ✅ Pagination (limit, offset)
- ✅ CRUD operations

### ✅ Materials API (`tests/api/materials.test.ts`)
- `GET /api/materials` - lista materijala
- `GET /api/materials/[id]` - detalji materijala
- `POST /api/materials/[id]/download` - download tracking

**Test cases:**
- ✅ Listing materials
- ✅ Filtering (type, subject, search)
- ✅ Pagination
- ✅ Material details retrieval
- ✅ Download count increment
- ✅ Error handling (404)

## Mockovi

### Prisma Client
Prisma client je mock-iran u `tests/setup.ts` sa svim potrebnim metodama:
- `findUnique`, `findMany`, `create`, `update`, `delete`, `count`, `aggregate`

### NextAuth
NextAuth session je mock-iran:
- `getServerSession()` se može kontrolirati u svakom testu

### Environment Variables
Postavljene su test env varijable u `setup.ts`:
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL`

## Pisanje novih testova

### Primjer unit testa

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { myFunction } from '@/lib/myModule'

describe('My Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should do something', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

### Primjer API route testa

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/my-route/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

vi.mock('next-auth')
vi.mock('@/lib/prisma')

describe('My API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return data', async () => {
    const mockSession = {
      user: { id: '123', role: 'ADMIN' }
    }
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.myModel.findMany).mockResolvedValue([])

    const req = new NextRequest('http://localhost:3000/api/my-route')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})
```

## Best Practices

1. **清リ mockove** u `beforeEach()` da osiguraš izolirane testove
2. **Test jedan koncept** po testu
3. **Koristi descriptive test names** koji objašnjavaju što se testira
4. **Grupiranje testova** sa `describe()` blokovima
5. **Test edge cases** - greške, nedostajući podaci, boundary values
6. **Mock external dependencies** - API pozivi, database, auth
7. **Assertuj sve relevantne stvari** - status code, response data, mock calls

## Coverage Ciljevi

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

Fokus na:
- ✅ Auth & authorization logic
- ✅ API route handlers
- ✅ Business logic funkcije
- ✅ Error handling
- ✅ Edge cases

Možeš preskočiti:
- UI komponente (testirati sa E2E)
- Mock data
- Config fajlovi

## CI/CD Integration

Dodaj u GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Sljedeći koraci

- [ ] Dodati testove za Homework API
- [ ] Dodati testove za Tests API
- [ ] Dodati testove za Rewards API
- [ ] Dodati E2E testove sa Playwright
- [ ] Setup continuous integration
- [ ] Coverage reporting
