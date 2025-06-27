import React, { useRef } from 'react';
import type { UsedName } from '../types';
import { exportUsedNames, importUsedNames, clearUsedNames } from '../services/storage';

interface UsedNamesHistoryProps {
  usedNames: UsedName[];
  onUsedNamesUpdate: (names: UsedName[]) => void;
}

export const UsedNamesHistory: React.FC<UsedNamesHistoryProps> = ({
  usedNames,
  onUsedNamesUpdate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportUsedNames();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedNames = await importUsedNames(file);
      onUsedNamesUpdate(importedNames);
      alert(`Zaimportowano ${importedNames.length} imion.`);
    } catch (error) {
      alert(`Błąd importu: ${(error as Error).message}`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie użyte imiona?')) {
      clearUsedNames();
      onUsedNamesUpdate([]);
    }
  };

  const formatConfig = (config: UsedName['config']) => {
    const parts = `${config.parts} ${config.parts === 1 ? 'człon' : 'człony'}`;
    const style = config.style === 'serious' ? 'poważne' : 'kapitan bomba';
    const origin = config.origin === 'polish' ? 'polskie' : 'zagraniczne';
    return `${parts}, ${style}, ${origin}`;
  };

  return (
    <div className="used-names-history">
      <div className="history-header">
        <h3>Historia Użytych Imion ({usedNames.length})</h3>
        <div className="history-actions">
          <button onClick={handleExport} disabled={usedNames.length === 0}>
            Eksportuj
          </button>
          <button onClick={handleImportClick}>
            Importuj
          </button>
          <button 
            onClick={handleClear} 
            className="danger"
            disabled={usedNames.length === 0}
          >
            Wyczyść
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {usedNames.length === 0 ? (
        <p className="no-history">Nie wybrano jeszcze żadnych imion.</p>
      ) : (
        <div className="history-list">
          {usedNames
            .sort((a, b) => b.selectedAt - a.selectedAt)
            .map((usedName, index) => (
              <div key={index} className="history-item">
                <div className="name-info">
                  <div className="name">{usedName.name}</div>
                  <div className="config">{formatConfig(usedName.config)}</div>
                </div>
                <div className="date">
                  {new Date(usedName.selectedAt).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}; 