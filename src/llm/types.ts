export interface LLMResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export interface LLMConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, config?: LLMConfig): Promise<LLMResponse>;
}

export type LLMProviderName = 'openai' | 'gemini';

export interface AIProviderConfig {
  name: string;
  envKey: string;
  defaultModel: string;
  displayName: string;
}
