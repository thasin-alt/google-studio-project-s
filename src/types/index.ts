export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  project: string;
  createdAt: string;
  lastUsed?: string;
  tier: 'free' | 'payg';
  isActive: boolean;
  notes?: string;
  usageCount: number;
  status: 'valid' | 'testing' | 'invalid' | 'untested';
  statusMessage?: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'vision' | 'code' | 'extraction' | 'system' | 'creative';
  systemInstruction?: string;
  promptText: string;
  model: string;
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  isFavorite: boolean;
  tags: string[];
  updatedAt: string;
  sampleImage?: string;
}

export interface GeminiModelInfo {
  id: string;
  displayName: string;
  description: string;
  contextWindow: string;
  recommendedFor: string;
  speed: 'Ultra Fast' | 'Fast' | 'Deep Reasoning';
  badgeColor: string;
  supportsMultimodal: boolean;
  costPer1MTokens: {
    input: string;
    output: string;
  };
}

export interface GenerationResult {
  text: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  timestamp: string;
  finishReason?: string;
  error?: string;
}
