export interface NameConfig {
  style: 'serious' | 'kapitan-bomba'; // poważne vs. kapitan bomba
  origin: 'polish' | 'foreign'; // polskie vs. zagraniczne
}

export interface GeneratedName {
  id: string;
  name: string;
  config: NameConfig;
  timestamp: number;
}

export interface UsedName {
  name: string;
  normalizedName: string; // lowercase dla porównań
  selectedAt: number;
  config: NameConfig;
}

export interface NameGeneratorState {
  isGenerating: boolean;
  generatedNames: GeneratedName[];
  usedNames: UsedName[];
  error: string | null;
} 