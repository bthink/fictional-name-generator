import React from 'react';
import type { GeneratedName } from '../types';
import { isNameUsed } from '../services/storage';

interface GeneratedNamesProps {
  generatedNames: GeneratedName[];
  onSelectName: (name: string) => void;
  error: string | null;
}

export const GeneratedNames: React.FC<GeneratedNamesProps> = ({
  generatedNames,
  onSelectName,
  error
}) => {
  if (error) {
    return (
      <div className="error-message">
        <h3>Błąd:</h3>
        <p>{error}</p>
        <p>Sprawdź czy masz prawidłowy klucz OpenAI API w pliku .env</p>
      </div>
    );
  }

  if (generatedNames.length === 0) {
    return (
      <div className="no-names">
        <p>Skonfiguruj parametry i wygeneruj imiona.</p>
      </div>
    );
  }

  return (
    <div className="generated-names">
      <h3>Wybierz jedno z wygenerowanych imion:</h3>
      <div className="names-list">
        {generatedNames.map((nameObj) => {
          const isUsed = isNameUsed(nameObj.name);
          
          return (
            <div key={nameObj.id} className="name-card">
              <div className="name-text">
                {nameObj.name}
                {isUsed && <span className="used-indicator">(już użyte)</span>}
              </div>
              <button
                className={`select-button ${isUsed ? 'disabled' : ''}`}
                onClick={() => onSelectName(nameObj.name)}
                disabled={isUsed}
              >
                {isUsed ? 'Już użyte' : 'Wybierz'}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="generation-info">
        <small>
          Wygenerowano: {new Date(generatedNames[0]?.timestamp).toLocaleString()}
        </small>
      </div>
    </div>
  );
}; 