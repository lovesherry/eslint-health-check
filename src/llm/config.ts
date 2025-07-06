// AI 提供者配置定义

import { AIProviderConfig } from './types';

// 支持的 AI 提供者配置
export const AI_PROVIDERS: Record<string, AIProviderConfig> = {
  gemini: {
    name: 'gemini',
    envKey: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    displayName: 'Gemini',
  },
  openai: {
    name: 'openai',
    envKey: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4',
    displayName: 'OpenAI',
  },
  // 未来可以轻松添加更多提供者
  // anthropic: {
  //   name: 'anthropic',
  //   envKey: 'ANTHROPIC_API_KEY',
  //   defaultModel: 'claude-3-sonnet',
  //   displayName: 'Anthropic Claude',
  // },
};

// 获取可用的提供者
export function getAvailableProviders(env: Record<string, string>): string[] {
  return Object.values(AI_PROVIDERS)
    .filter((provider) => env[provider.envKey])
    .map((provider) => provider.name);
}

// 根据提供者名称获取配置
export function getProviderConfig(
  providerName: string
): AIProviderConfig | null {
  return AI_PROVIDERS[providerName] || null;
}

// 根据提供者名称获取 API Key
export function getApiKey(
  providerName: string,
  env: Record<string, string>
): string | null {
  const config = getProviderConfig(providerName);
  return config ? env[config.envKey] || null : null;
}
