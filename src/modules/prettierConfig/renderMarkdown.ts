import { aggregatePrettierConfigByType } from '.';
import type { PrettierConfigByType } from '../../types';

function render(prettierRuleList: PrettierConfigByType[]): string {
  let md = '\n## Prettier 配置聚合与状态分析\n';
  if (
    prettierRuleList &&
    prettierRuleList.length > 0 &&
    prettierRuleList.some((r) => r.prettierConfig)
  ) {
    for (const fileResult of prettierRuleList) {
      if (fileResult.prettierConfig) {
        const jsonFile = `prettier-for-${fileResult.fileType}.json`;
        const config = fileResult.prettierConfig;
        md += `- **文件类型**: ${fileResult.fileType}  **配置项数**: [${Object.keys(config).length}](./${jsonFile})\n`;
        md += '```json\n';
        md += JSON.stringify(config, null, 2) + '\n';
        md += '```\n';
      } else {
        md += `- **文件类型**: ${fileResult.fileType}  未检测到 Prettier 配置\n`;
      }
    }
  } else {
    md += '- 未检测到 Prettier 配置\n';
  }
  md += '\n---\n\n';
  return md;
}

export async function renderPrettierConfig(): Promise<string> {
  const prettierRuleList = await aggregatePrettierConfigByType();
  return render(prettierRuleList);
}
