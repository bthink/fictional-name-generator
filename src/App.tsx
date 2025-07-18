import { useState, useEffect } from 'react';
import type { NameConfig, GeneratedName, UsedName } from './types';
import { NameConfigForm } from './components/NameConfigForm';
import { GeneratedNames } from './components/GeneratedNames';
import { UsedNamesHistory } from './components/UsedNamesHistory';
import { generateNames } from './services/openai';
import { loadUsedNames, addUsedName, getUsedNamesForGeneration } from './services/storage';
import './App.css';

function App() {
  const [config, setConfig] = useState<NameConfig>({
    style: 'serious',
    origin: 'polish'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [usedNames, setUsedNames] = useState<UsedName[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Ładowanie użytych imion przy starcie
  useEffect(() => {
    setUsedNames(loadUsedNames());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const usedNamesForGeneration = getUsedNamesForGeneration();
      const names = await generateNames(config, usedNamesForGeneration);
      
      const timestamp = Date.now();
      const generatedWithId: GeneratedName[] = names.map((name, index) => ({
        id: `${timestamp}-${index}`,
        name,
        config,
        timestamp
      }));
      
      setGeneratedNames(generatedWithId);
    } catch (err) {
      setError((err as Error).message);
      setGeneratedNames([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectName = (selectedName: string) => {
    const updatedUsedNames = addUsedName(selectedName, config);
    setUsedNames(updatedUsedNames);
    
    // Wyczyść wygenerowane imiona po wyborze
    setGeneratedNames([]);
    
    // Pokaż komunikat
    alert(`Wybrano imię: "${selectedName}"`);
  };

  const handleUsedNamesUpdate = (names: UsedName[]) => {
    setUsedNames(names);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>🎭 Generator Fikcyjnych Imion</h1>
          <p>Stwórz unikalne imiona dla swoich postaci!</p>
        </header>

        <main className="app-main">
          <section className="params-section">
            <NameConfigForm
              config={config}
              onConfigChange={setConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </section>

          <section className="names-section">
            <GeneratedNames
              generatedNames={generatedNames}
              onSelectName={handleSelectName}
              error={error}
            />
          </section>

          <aside className="history-section">
            <UsedNamesHistory
              usedNames={usedNames}
              onUsedNamesUpdate={handleUsedNamesUpdate}
            />
          </aside>
        </main>

        
      </div>
    </div>
  );
}

export default App;
