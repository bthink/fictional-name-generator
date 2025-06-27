import React from 'react';
import type { NameConfig } from '../types';

interface NameConfigFormProps {
  config: NameConfig;
  onConfigChange: (config: NameConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const NameConfigForm: React.FC<NameConfigFormProps> = ({
  config,
  onConfigChange,
  onGenerate,
  isGenerating
}) => {
  const handleChange = (field: keyof NameConfig, value: number | string) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="config-form">
      <h2>Generator Fikcyjnych Imion</h2>
      
      <div className="form-group">
        <label htmlFor="parts">Liczba członów imienia:</label>
        <select
          id="parts"
          value={config.parts}
          onChange={(e) => handleChange('parts', parseInt(e.target.value))}
          disabled={isGenerating}
        >
          <option value={1}>1 człon (np. "Bartosz")</option>
          <option value={2}>2 człony (np. "Bartosz Niszczyciel")</option>
          <option value={3}>3 człony (np. "Bartosz Niszczyciel Dusz")</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="style">Styl imienia:</label>
        <select
          id="style"
          value={config.style}
          onChange={(e) => handleChange('style', e.target.value)}
          disabled={isGenerating}
        >
          <option value="serious">Poważne/Epickie</option>
          <option value="kapitan-bomba">Kapitan Bomba Style</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="origin">Pochodzenie:</label>
        <select
          id="origin"
          value={config.origin}
          onChange={(e) => handleChange('origin', e.target.value)}
          disabled={isGenerating}
        >
          <option value="polish">Polskie</option>
          <option value="foreign">Zagraniczne</option>
        </select>
      </div>

      <button 
        className="generate-button"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generuję...' : 'Generuj Imiona'}
      </button>
    </div>
  );
}; 