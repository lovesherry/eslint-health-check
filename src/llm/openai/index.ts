import OpenAI, { type OpenAI as OpenAIClient } from 'openai';
import type { LLMProvider, LLMConfig, LLMResponse } from '../types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAIClient | null = null;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    if (config.apiKey) {
      this.client = new OpenAI({
        apiKey: config.apiKey,
      });
    }
  }

  get name(): string {
    return 'openai';
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateText(prompt: string, config?: LLMConfig): Promise<LLMResponse> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'OpenAI API key is not configured',
      };
    }

    try {
      const model = config?.model || this.config.model || 'gpt-4';
      const temperature = config?.temperature || this.config.temperature || 0.7;
      const maxTokens = config?.maxTokens || this.config.maxTokens || 1000;

      const completion = await this.client!.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      });

      const text = completion.choices[0]?.message?.content;

      if (!text) {
        return {
          success: false,
          error: 'No response text received from OpenAI',
        };
      }

      return {
        success: true,
        text,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error getting OpenAI response:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
