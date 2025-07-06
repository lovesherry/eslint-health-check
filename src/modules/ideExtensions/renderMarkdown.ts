import type { HealthCheckData } from '../../types';

export function renderIDEExtensions(healthCheckData: HealthCheckData): string {
  const { currentIDE, hasEslintExtension, hasPrettierExtension } =
    healthCheckData;

  let md = '## IDE 插件检测\n';
  md += `\n### ${currentIDE}\n\n`;

  // ESLint 扩展状态
  md += `- **ESLint 扩展**: ${hasEslintExtension ? '✅ 已安装' : '❌ 未安装'}\n`;
  if (!hasEslintExtension) {
    md += `  > ⚠️  **建议**: 安装 ESLint 扩展以获得更好的开发体验\n`;
  }

  // Prettier 扩展状态
  md += `- **Prettier 扩展**: ${hasPrettierExtension ? '✅ 已安装' : '❌ 未安装'}\n`;
  if (!hasPrettierExtension) {
    md += `  > ⚠️  **建议**: 安装 Prettier 扩展以获得代码格式化功能\n`;
  }

  // 根据 IDE 类型提供特定建议
  if (currentIDE === 'vscode') {
    md += `\n**VSCode 特定建议**:\n`;
    md += `- 确保在设置中启用了 ESLint 和 Prettier\n`;
    md += `- 配置 \`editor.formatOnSave\` 为 true\n`;
    md += `- 设置 Prettier 为默认格式化工具\n`;
  } else if (currentIDE === 'cursor') {
    md += `\n**Cursor 特定建议**:\n`;
    md += `- Cursor 内置了 ESLint 支持，无需额外安装\n`;
    if (hasPrettierExtension) {
      md += `- 注意：Cursor 的 Prettier 扩展可能存在配置文件读取问题\n`;
    }
  }

  md += '\n---\n';
  return md;
}
