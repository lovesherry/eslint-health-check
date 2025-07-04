import type { ConfigFormatResult } from '../../types';
import { analyzeEslintConfigFormat } from './index';

function render(configFormat: ConfigFormatResult): string {
  let md = '## 配置格式与 ESLint 版本兼容性\n';
  md += `- **ESLint 版本**: ${configFormat.eslintVersion}\n`;
  md += `- **配置文件**: ${configFormat.configFile ?? '未检测到'}\n`;
  md += `- **配置类型**: ${configFormat.configType}\n`;
  if (configFormat.compatible) {
    md += '- ✅ 配置格式与 ESLint 版本兼容\n';
  } else {
    md += '- ❌ 存在兼容性问题：\n';
    for (const issue of configFormat.issues) {
      md += `  - ${issue}\n`;
    }
  }
  md += '\n---\n\n';
  return md;
}

export function renderEslintConfigFormat(): string {
  try {
    const configFormat = analyzeEslintConfigFormat();
    return render(configFormat);
  } catch {
    return '';
  }
}
