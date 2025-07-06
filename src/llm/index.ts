// LLM 模块 - 提供 AI 文本生成功能

import { loadEnvFile } from '../utils/envUtil';
import { selectAIProvider } from '../utils/inquirer';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import type {
  LLMProvider,
  LLMConfig,
  LLMResponse,
  LLMProviderName,
} from './types';
import { getAvailableProviders, getProviderConfig } from './config';

// 简化的 LLM 管理器
class LLMManager {
  private provider: LLMProvider | null = null;

  setProvider(provider: LLMProvider): void {
    this.provider = provider;
  }

  getProvider(): LLMProvider | null {
    return this.provider;
  }

  isAvailable(): boolean {
    return this.provider?.isAvailable() || false;
  }

  async generateText(prompt: string, config?: LLMConfig): Promise<LLMResponse> {
    if (!this.provider) {
      return {
        success: false,
        error: 'No LLM provider configured',
      };
    }

    return this.provider.generateText(prompt, config);
  }
}

// 创建提供者的工厂函数
function createProvider(
  name: LLMProviderName,
  apiKey: string,
  config?: LLMConfig
): LLMProvider {
  const fullConfig: LLMConfig = {
    apiKey,
    ...config,
  };

  switch (name) {
    case 'gemini':
      return new GeminiProvider(fullConfig);
    case 'openai':
      return new OpenAIProvider(fullConfig);
    default:
      throw new Error(`Unsupported LLM provider: ${name as string}`);
  }
}

// 全局 LLM 管理器实例
let llmManagerInstance: LLMManager | null = null;

// 初始化 LLM 管理器
async function initializeLLM(): Promise<LLMManager> {
  const llmManager = new LLMManager();
  const env = loadEnvFile();
  const availableProviders = getAvailableProviders(env);

  if (availableProviders.length === 0) {
    console.log('ℹ️  No AI providers available. AI features will be disabled.');
    return llmManager;
  }

  let selectedProviderName: string;

  if (availableProviders.length === 1) {
    selectedProviderName = availableProviders[0];
  } else {
    selectedProviderName = await selectAIProvider(availableProviders);
  }

  const providerConfig = getProviderConfig(selectedProviderName);
  const apiKey = env[providerConfig!.envKey];
  const model = env['model'] || providerConfig!.defaultModel;

  if (apiKey) {
    const provider = createProvider(
      selectedProviderName as LLMProviderName,
      apiKey,
      { model }
    );
    llmManager.setProvider(provider);
    console.log(`✅ Using ${providerConfig!.displayName} as AI provider`);
  }

  return llmManager;
}

// 获取或初始化 LLM 管理器
export async function getLLMManager(): Promise<LLMManager> {
  if (!llmManagerInstance) {
    llmManagerInstance = await initializeLLM();
  }
  return llmManagerInstance;
}

// // 核心 API：生成 AI 文本
// export async function generateText(
//   prompt: string,
//   config?: LLMConfig
// ): Promise<LLMResponse> {
//   const manager = await getLLMManager();
//   return manager.generateText(prompt, config);
// }

// 检查 AI 是否可用
export function isAIAvailable(): boolean {
  return llmManagerInstance?.isAvailable() || false;
}

// 获取当前使用的提供者名称
export function getCurrentProvider(): string | null {
  return llmManagerInstance?.getProvider()?.name || null;
}

export type { LLMConfig, LLMResponse };
