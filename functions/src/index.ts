import * as functions from 'firebase-functions';
import * as cors from 'cors';
import OpenAI from 'openai';

// Konfiguracja CORS
const corsHandler = cors({ origin: true });

// Konfiguracja OpenAI - klucz będzie brany z environment variables Firebase
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key
});

interface NameConfig {
  style: 'serious' | 'funny';
  origin: 'polish' | 'foreign';
}

export const generateNames = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Sprawdzenie metody HTTP
      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Metoda nie obsługiwana' });
        return;
      }

      const { config, usedNames } = request.body as {
        config: NameConfig;
        usedNames: string[];
      };

      if (!config) {
        response.status(400).json({ error: 'Brak konfiguracji' });
        return;
      }

      const { style, origin } = config;
      
      const styleDescription = style === 'serious' 
        ? 'poważne, epickie, realistyczne' 
        : 'zabawne, w stylu serialu "Kapitan Bomba" (polskie imiona jak Przemek, Dominik, Grzegorz)';
        
      const originDescription = origin === 'polish' 
        ? 'polskie' 
        : 'zagraniczne (angielskie, niemieckie, francuskie itp.)';

      const usedNamesText = usedNames?.length > 0 
        ? `\n\nUnikaj tych już użytych imion: ${usedNames.join(', ')}`
        : '';

      const prompt = `Wygeneruj dokładnie 3 różne imiona postaci do gier fantasy/RPG o następujących parametrach:

- Styl: ${styleDescription}
- Pochodzenie: ${originDescription}

Imiona mogą być jedno- lub wieloczłonowe (dowolna liczba słów), wybieraj kreatywnie.
Każde imię zwróć w osobnej linii, bez numeracji, bez dodatkowych opisów.${usedNamesText}

Przykłady różnych długości:
- Krótkie: "Bartosz", "Ragnar", "Elsa"
- Średnie: "Bartosz Niszczyciel", "Aragorn Wędrówka", "Zelda Mądrość"  
- Długie: "Bartosz Niszczyciel Dusz", "Aragorn Syn Aratorna", "Gandalf Szary Czarodziej"
- Kapitan Bomba: "Przemek", "Dominik Władca", "Grzegorz Mistrz Kiełbasy"`;

      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.8,
      });

      const content = openaiResponse.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Brak odpowiedzi od OpenAI');
      }

      const names = content
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0)
        .slice(0, 3); // Zawsze dokładnie 3 imiona

      response.json({ names });
      
    } catch (error) {
      console.error('Błąd generowania imion:', error);
      response.status(500).json({ 
        error: 'Nie udało się wygenerować imion',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      });
    }
  });
}); 