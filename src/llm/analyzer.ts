// AI 分析器 - 基于健康检查数据提供建议

import { getLLMManager } from './index';
import type { LLMResponse } from './types';

class AIAnalyzer {
  private markdownContext: string = '';

  // 设置 Markdown 上下文
  setMarkdownContext(markdown: string): void {
    this.markdownContext = markdown;
  }

  // 构建完整的提示
  private buildPrompt(): string {
    return `基于以下 ESLint 健康检查报告，请分析存在的问题并提供改进建议。

# ESLint 健康检查报告

${this.markdownContext}

请从以下几个方面进行分析，并使用 Markdown 格式输出：

### 问题分析
- 配置问题
- 依赖兼容性问题
- 规则使用问题
- IDE 设置问题

### 改进建议
- 具体、可操作的改进建议
- 最佳实践建议
- 配置优化建议

### 操作步骤
- 详细的修复步骤
- 配置修改建议

**注意：** 
- 需结合项目的实际使用环境，如 browser / node
- 提供配置修改建议时需匹配当前 ESLint 版本和配置格式（传统配置(extends) vs flat config）。


请使用 Markdown 语法格式输出，包括标题、列表、代码块等。`;
  }

  // 分析数据并回答问题
  async analyze(): Promise<LLMResponse> {
    const manager = await getLLMManager();
    const prompt = this.buildPrompt();

    const response = await manager.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 2000,
    });

    return response;
  }

  // 获取 Markdown 上下文
  getMarkdownContext(): string {
    return this.markdownContext;
  }
}

// 单例模式
let analyzer: AIAnalyzer | null = null;

function getAnalyzer(): AIAnalyzer {
  if (!analyzer) {
    analyzer = new AIAnalyzer();
  }
  return analyzer;
}

// 初始化分析器
export function initializeAnalyzer(markdown: string): void {
  const analyzerInstance = getAnalyzer();
  analyzerInstance.setMarkdownContext(markdown);
}

// 分析数据并获取建议
export async function analyzeHealthCheck(): Promise<LLMResponse> {
  const analyzer = getAnalyzer();
  return analyzer.analyze();
}
