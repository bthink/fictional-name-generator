import OpenAI from 'openai';
import type { NameConfig } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Tylko dla development
});

export const generateNames = async (config: NameConfig, usedNames: string[]): Promise<string[]> => {
  const { style, origin } = config;
  
  const styleDescription = style === 'serious' 
    ? 'poważne, epickie, realistyczne' 
    : 'zabawne, w stylu serialu "Kapitan Bomba" (polskie imiona jak Przemek, Dominik, Grzegorz)';
    
  const originDescription = origin === 'polish' 
    ? 'polskie' 
    : 'zagraniczne (angielskie, niemieckie, francuskie itp.)';

  const usedNamesText = usedNames.length > 0 
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

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Brak odpowiedzi od OpenAI');

    return content
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .slice(0, 3); // Zawsze dokładnie 3 imiona
      
  } catch (error) {
    console.error('Błąd generowania imion:', error);
    throw new Error('Nie udało się wygenerować imion. Sprawdź klucz API.');
  }
}; 