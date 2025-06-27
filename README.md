# 🎭 Generator Fikcyjnych Imion

Nowoczesna aplikacja React do generowania unikalnych imion postaci dla gier, pisania i innych projektów kreatywnych. Używa GPT-3.5 do tworzenia imion zgodnie z Twoimi preferencjami.

## ✨ Funkcjonalności

- **3 parametry konfiguracji:**
  - Liczba członów (1-3) - od "Bartosz" do "Bartosz Niszczyciel Dusz"
  - Styl - poważne/epickie vs. "Kapitan Bomba" style
  - Pochodzenie - polskie vs. zagraniczne

- **Zarządzanie użytymi imionami:**
  - Lokalne przechowywanie w localStorage
  - Sprawdzanie duplikatów (case-insensitive)
  - Eksport/import do pliku JSON
  - Historia z datami i konfiguracją

- **Nowoczesny UX:**
  - Responsywny design
  - Real-time walidacja
  - Loading states
  - Error handling

## 🚀 Szybki Start

### 1. Klonowanie i instalacja

```bash
cd fictional-name-generator
npm install
```

### 2. Konfiguracja OpenAI API

Stwórz plik `.env` w głównym katalogu:

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Uruchomienie

```bash
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`

## 🛠️ Technologie

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Nowoczesny CSS z CSS Variables
- **API:** OpenAI GPT-3.5 Turbo
- **Storage:** localStorage z JSON export/import
- **Build:** Vite (szybki development i optimized production)

## 📁 Struktura Projektu

```
src/
├── components/           # Komponenty React
│   ├── NameConfigForm.tsx
│   ├── GeneratedNames.tsx
│   └── UsedNamesHistory.tsx
├── services/            # Logika biznesowa
│   ├── openai.ts       # Integration z OpenAI API
│   └── storage.ts      # LocalStorage management
├── types.ts            # TypeScript definitions
├── App.tsx             # Główny komponent
└── App.css             # Style CSS
```

## 🔧 Konfiguracja

### OpenAI API Key

1. Załóż konto na [OpenAI Platform](https://platform.openai.com/)
2. Wygeneruj API key w sekcji "API Keys"
3. Dodaj go do pliku `.env` jako `VITE_OPENAI_API_KEY`

### Customizacja Prompts

Możesz dostosować prompty dla GPT w pliku `src/services/openai.ts`:

```typescript
const prompt = `Wygeneruj dokładnie 3 różne imiona...`;
```

## 📖 Użytkowanie

1. **Konfiguruj parametry** - wybierz liczbę członów, styl i pochodzenie
2. **Generuj imiona** - kliknij "Generuj Imiona" (wymaga połączenia z internetem)
3. **Wybierz imię** - kliknij "Wybierz" przy wybranym imieniu
4. **Zarządzaj historią** - eksportuj/importuj lub wyczyść użyte imiona

### Przykłady Generowanych Imion

**Poważne polskie (3 człony):**
- Bartosz Niszczyciel Dusz
- Aleksandra Strażniczka Światła
- Mikołaj Władca Burz

**Kapitan Bomba style:**
- Przemek Jedynak
- Dominik Mistrz Kiełbasy
- Grzegorz Pogromca Kosmitów

## 🚀 Deployment

### Build produkcyjny

```bash
npm run build
```

Pliki będą w katalogu `dist/` - gotowe do hostowania na dowolnym static hosting (Netlify, Vercel, GitHub Pages).

### Environment Variables

W produkcji ustaw:
- `VITE_OPENAI_API_KEY` - Twój klucz OpenAI API

## 🤝 Rozwój

### Dodawanie nowych stylów imion

1. Rozszerz typ `NameConfig.style` w `src/types.ts`
2. Dodaj opcję w `NameConfigForm.tsx`
3. Zaktualizuj prompt w `src/services/openai.ts`

### Dodawanie nowych źródeł imion

1. Dodaj nowy service w `src/services/`
2. Zaktualizuj interface w `src/types.ts`
3. Zmodyfikuj logikę w `App.tsx`

## 📝 License

MIT License - zobacz [LICENSE](LICENSE)

## 🐛 Zgłaszanie błędów

Masz problem? Stwórz issue z opisem:
- Kroki do reprodukcji
- Oczekiwane vs. rzeczywiste zachowanie
- Informacje o środowisku (browser, OS)

---

**Tip:** Aplikacja działa najlepiej z aktualną wersją Chrome/Firefox. Wymaga połączenia z internetem do generowania imion.
