import { aggregateEslintRulesWithAPI } from '.';
import type { FileRuleAnalysis } from '../../types';

function render(enabledRuleList: FileRuleAnalysis[]): string {
  let md = '## 规则聚合与状态分析\n';
  for (const fileResult of enabledRuleList) {
    const jsonFile = fileResult.fileType
      ? `eslint-rules-for-${fileResult.fileType}.json`
      : '';
    if (jsonFile) {
      md += `- **文件类型**: ${fileResult.fileType}  **规则总数**: [${fileResult.rules.length}](./${jsonFile})\n`;
    } else {
      md += `- **文件类型**: ${fileResult.fileType}  **规则总数**: ${fileResult.rules.length}\n`;
    }
  }
  md += '\n---\n\n';
  return md;
}

export async function renderEslintRules(): Promise<string> {
  const enabledRuleList = await aggregateEslintRulesWithAPI();
  return render(enabledRuleList);
}
