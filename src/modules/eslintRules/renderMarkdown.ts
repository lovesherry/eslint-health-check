import type { EslintRulesResult } from '../../types';

export function renderEslintRules(results: EslintRulesResult[]): string {
  let md = '## Eslint 匹配规则如下：\n';

  for (const result of results) {
    if (result.errorMsg) {
      md += `- **文件类型**: \`${result.ext}\` ， ❌ 分析失败: ${result.errorMsg}\n`;
    } else {
      const jsonFile = `eslint-rules-for-${result.ext.slice(1)}.json`;
      md += `- **文件类型**: \`${result.ext}\` ， **生效规则总数**: [${result.rules.length}](./${jsonFile})\n`;
    }
  }

  md += '\n---\n\n';
  return md;
}
