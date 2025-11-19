# Code Quality Tools

Ovaj dokument opisuje code quality alate i kako ih koristiti u Instrukcije projektu.

## 🎨 Prettier - Code Formatting

Prettier je opinionated code formatter koji automatski formatira kod prema definiranim pravilima.

### Konfiguracija

Konfiguracija je u `.prettierrc.json`:
- **Semi**: false (bez semicolona)
- **Single Quote**: true (koristi single quotes)
- **Print Width**: 100 (max line length)
- **Tab Width**: 2 spaces
- **Trailing Comma**: es5 style

### Korištenje

```bash
# Formataj sve fajlove
npm run format

# Provjeri da li su fajlovi formatirani
npm run format:check
```

### VS Code Integration

Instaliraj Prettier extension i dodaj u `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## 🔍 ESLint - Code Linting

ESLint provjerava kod za potencijalne greške i stilske probleme.

### Konfiguracija

Konfiguracija je u `.eslintrc.json`:
- Extends Next.js i TypeScript rules
- Warn na unused variables (ignoriraj _ prefix)
- Warn na `any` type
- Error na `var` (koristi `const`/`let`)
- Warn na console.log (osim warn/error)

### Korištenje

```bash
# Pokreni linter
npm run lint

# Automatski fix-aj probleme
npm run lint:fix
```

### Pravila

#### TypeScript Rules
- ✅ **Warn**: `@typescript-eslint/no-unused-vars` - Neiskorištene varijable
- ⚠️ **Warn**: `@typescript-eslint/no-explicit-any` - Korištenje `any` type
- ✅ **Warn**: `@typescript-eslint/no-non-null-assertion` - Non-null assertions

#### React Rules
- ❌ **Error**: `react-hooks/rules-of-hooks` - Hooks rules violation
- ⚠️ **Warn**: `react-hooks/exhaustive-deps` - Missing dependencies

#### General Rules
- ⚠️ **Warn**: `no-console` - console.log u kodu (dozvoljeni warn/error)
- ❌ **Error**: `no-var` - Korištenje `var` umjesto `const`/`let`
- ❌ **Error**: `eqeqeq` - Korištenje `==` umjesto `===`

---

## 🪝 Git Hooks (Husky + Lint-Staged)

Automatski pokreće linting i formatting prije commit-a.

### Setup (jednom za projekt)

```bash
# Instaliraj dependencies
npm install -D husky lint-staged

# Inicijaliziraj husky
npx husky init

# Kreiraj pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### Konfiguracija

`.lintstagedrc.json` definira što se pokreće:
- **TypeScript/JavaScript fajlovi**: ESLint fix + Prettier
- **JSON/CSS/Markdown fajlovi**: Prettier
- **TypeScript fajlovi**: Type check

### Kako radi?

1. Napraviš promjene u kodu
2. `git add .`
3. `git commit -m "message"`
4. **Automatski se pokreće:**
   - ESLint --fix (automatski fix probleme)
   - Prettier --write (formataj fajlove)
   - TypeScript type check
5. Ako sve prođe ✅ → Commit uspješan
6. Ako ima grešaka ❌ → Commit blokiran, moraš fix-ati

### Skip hooks (samo u posebnim slučajevima!)

```bash
# Skip pre-commit hook
git commit --no-verify -m "message"
```

⚠️ **Napomena**: Koristi `--no-verify` samo u iznimnim situacijama!

---

## 📝 EditorConfig

`.editorconfig` osigurava konzistentne editor settings:
- UTF-8 encoding
- LF line endings (Unix style)
- 2 spaces indent
- Trim trailing whitespace
- Insert final newline

Većina editora automatski koristi ove postavke. Za VS Code, instaliraj "EditorConfig for VS Code" extension.

---

## 🚀 Workflow

### Prije commita (automatski):

```bash
git add .
git commit -m "feat: dodaj novu funkcionalnost"

# Automatski se pokreće:
# 1. lint-staged → ESLint + Prettier + Type check
# 2. Ako sve prođe → Commit
```

### Manualno formatiranje:

```bash
# Formataj sve fajlove
npm run format

# Provjeri formatiranje (CI)
npm run format:check

# Fixy lint probleme
npm run lint:fix
```

### VS Code Shortcuts:

- **Format Document**: `Shift + Alt + F`
- **Format Selection**: `Ctrl + K, Ctrl + F`
- **Fix All ESLint**: `Ctrl + Shift + P` → "ESLint: Fix all auto-fixable Problems"

---

## 📦 Required Dependencies

Za potpunu funkcionalnost, instaliraj:

```bash
npm install -D prettier eslint-config-prettier
npm install -D husky lint-staged
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 🎯 Best Practices

1. **Commitaj formatiran kod** - Pusti Prettier da formatira
2. **Fix-aj ESLint warninge** - Ne ignoriraj ih
3. **Koristi TypeScript strogo** - Izbjegavaj `any`
4. **Type check prije commit-a** - Osiguraj da nema type errors
5. **Consistent style** - Svi koriste iste alate

---

## 🆘 Troubleshooting

### Prettier ne formatira automatski

1. Provjeri da li imaš extension instaliran
2. Provjeri `.vscode/settings.json`
3. Restart VS Code

### ESLint ne pokazuje greške

1. Provjeri da li je ESLint extension instaliran
2. Restart ESLint server: `Ctrl + Shift + P` → "ESLint: Restart ESLint Server"

### Pre-commit hook ne radi

1. Provjeri da li je husky instaliran: `ls .husky/pre-commit`
2. Provjeri da li je executable: `chmod +x .husky/pre-commit`
3. Provjeri da li je lint-staged instaliran

### Type check traje predugo

U `.lintstagedrc.json`, možeš ukloniti type check ako je prespor:
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
    // Ukloni: "bash -c 'tsc --noEmit'"
  ]
}
```

---

## 📚 Dodatni resursi

- [Prettier Dokumentacija](https://prettier.io/docs/en/index.html)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Husky Dokumentacija](https://typicode.github.io/husky/)
- [EditorConfig](https://editorconfig.org/)

---

**Happy coding!** 🎉
