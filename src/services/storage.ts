import type { UsedName, NameConfig } from '../types';

const STORAGE_KEY = 'fictional-name-generator-used-names';

export const normalizeNameForComparison = (name: string): string => {
  return name.toLowerCase().trim();
};

export const loadUsedNames = (): UsedName[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Błąd ładowania użytych imion:', error);
    return [];
  }
};

export const saveUsedNames = (usedNames: UsedName[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usedNames));
  } catch (error) {
    console.error('Błąd zapisu użytych imion:', error);
  }
};

export const addUsedName = (name: string, config: NameConfig): UsedName[] => {
  const normalizedName = normalizeNameForComparison(name);
  const currentUsed = loadUsedNames();
  
  // Sprawdź czy już istnieje (case-insensitive)
  const exists = currentUsed.some(used => used.normalizedName === normalizedName);
  if (exists) {
    return currentUsed;
  }
  
  const newUsedName: UsedName = {
    name,
    normalizedName,
    selectedAt: Date.now(),
    config
  };
  
  const updatedUsed = [...currentUsed, newUsedName];
  saveUsedNames(updatedUsed);
  return updatedUsed;
};

export const isNameUsed = (name: string): boolean => {
  const normalizedName = normalizeNameForComparison(name);
  const usedNames = loadUsedNames();
  return usedNames.some(used => used.normalizedName === normalizedName);
};

export const getUsedNamesForGeneration = (): string[] => {
  return loadUsedNames().map(used => used.name);
};

export const exportUsedNames = (): void => {
  const usedNames = loadUsedNames();
  const dataStr = JSON.stringify(usedNames, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `fictional-names-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importUsedNames = (file: File): Promise<UsedName[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedNames: UsedName[] = JSON.parse(content);
        
        // Walidacja struktury
        if (!Array.isArray(importedNames)) {
          throw new Error('Nieprawidłowy format pliku');
        }
        
        // Sprawdź czy każdy element ma wymagane pola
        const isValid = importedNames.every(name => 
          typeof name.name === 'string' &&
          typeof name.normalizedName === 'string' &&
          typeof name.selectedAt === 'number' &&
          name.config
        );
        
        if (!isValid) {
          throw new Error('Nieprawidłowa struktura danych');
        }
        
        saveUsedNames(importedNames);
        resolve(importedNames);
      } catch (error) {
        reject(new Error('Błąd importu: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => reject(new Error('Błąd odczytu pliku'));
    reader.readAsText(file);
  });
};

export const clearUsedNames = (): void => {
  localStorage.removeItem(STORAGE_KEY);
}; 