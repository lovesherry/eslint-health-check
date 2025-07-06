import { GoogleGenAI } from '@google/genai';
import type { LLMProvider, LLMConfig, LLMResponse } from '../types';

export class GeminiProvider implements LLMProvider {
  private ai: GoogleGenAI | null = null;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    if (config.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    }
  }

  get name(): string {
    return 'gemini';
  }

  isAvailable(): boolean {
    return this.ai != null;
  }

  async generateText(prompt: string, config?: LLMConfig): Promise<LLMResponse> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'Gemini API key is not configured',
      };
    }

    try {
      const modelName = config?.model || this.config.model;

      const result = await this.ai!.models.generateContent({
        model: modelName as string,
        contents: prompt,
      });

      // 从响应中提取文本内容
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return {
          success: false,
          error: 'No response text received from Gemini',
        };
      }

      return {
        success: true,
        text: text,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error getting Gemini response:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
