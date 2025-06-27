# Bezpieczne wdrożenie na Firebase

## ⚠️ WAŻNE - Bezpieczeństwo klucza API

Ta aplikacja używa Firebase Functions do ukrycia klucza OpenAI API. Klucz NIE jest eksponowany w frontend bundlu.

## Kroki deployment:

### 1. Ustaw klucz OpenAI w Firebase Functions

```bash
# Zaloguj się do Firebase
firebase login

# Ustaw klucz OpenAI (ZAMIEŃ na swój prawdziwy klucz)
firebase functions:config:set openai.api_key="sk-your-actual-openai-key-here"
```

### 2. Znajdź swój Project ID

```bash
# Sprawdź project ID
firebase projects:list
```

### 3. Zaktualizuj URL w kodzie

W pliku `src/services/openai.ts`, zamień `YOUR_PROJECT_ID` na prawdziwy project ID:

```typescript
const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || 
  'https://us-central1-TWOJ_PROJECT_ID.cloudfunctions.net/generateNames';
```

### 4. Zbuduj i wdróż

```bash
# Zbuduj frontend
npm run build

# Wdróż funkcje i hosting
firebase deploy
```

### 5. (Opcjonalne) Ustaw custom URL

Jeśli chcesz używać custom URL dla Cloud Function:

```bash
# W pliku .env (NIE commituj tego pliku!)
echo "VITE_CLOUD_FUNCTION_URL=https://twoja-domena.com/api/generateNames" > .env.local
```

## Bezpieczeństwo ✅

- ✅ Klucz OpenAI jest ukryty w Firebase Functions
- ✅ Frontend nie zawiera żadnych sekretów
- ✅ CORS jest skonfigurowany
- ✅ Walidacja żądań na backendzie

## Testowanie lokalnie

```bash
# Uruchom emulator Functions
cd functions
npm run serve

# W drugim terminalu uruchom frontend z URL do emulatora
export VITE_CLOUD_FUNCTION_URL="http://localhost:5001/YOUR_PROJECT_ID/us-central1/generateNames"
npm run dev
```

## Koszt

Firebase Functions w planie Blaze:
- Pierwsze 2M wywołań/miesiąc: DARMOWE
- Potem: $0.40 za każdy kolejny 1M wywołań
- Czas wykonania: $0.0000025/100ms

Dla typowej aplikacji generującej imiona, koszt będzie praktycznie zero. 