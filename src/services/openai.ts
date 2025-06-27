import type { NameConfig } from '../types';

// URL do Cloud Function
const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || 
  'https://us-central1-names-generator-1686e.cloudfunctions.net/generateNames';

export const generateNames = async (config: NameConfig, usedNames: string[]): Promise<string[]> => {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config,
        usedNames
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.names || !Array.isArray(data.names)) {
      throw new Error('Nieprawidłowa odpowiedź z serwera');
    }

    return data.names;
      
  } catch (error) {
    console.error('Błąd generowania imion:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Nie udało się wygenerować imion. Spróbuj ponownie.');
  }
}; 