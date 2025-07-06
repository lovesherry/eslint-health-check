import type { PrettierConfigResult } from '../../types';

export function renderPrettierConfig(
  prettierRuleList: PrettierConfigResult[]
): string {
  let md = '\n## Prettier 配置如下：\n';
  if (prettierRuleList?.length > 0) {
    md += '✅ 已安装 Prettier 依赖\n';
    for (const fileResult of prettierRuleList) {
      if (fileResult.prettierConfig) {
        const config = fileResult.prettierConfig;
        md += `- **文件类型**: \`${fileResult.ext}\`， 规则如下：\n`;
        md += '```json\n';
        md += JSON.stringify(config, null, 2) + '\n';
        md += '```\n';
      } else {
        md += `- **文件类型**: ${fileResult.ext} ，未检测到 Prettier 配置。原因：${fileResult.errorMsg}\n`;
      }
    }
  } else {
    md += '❌ 未安装 Prettier 依赖\n';
  }
  md += '\n---\n\n';
  return md;
}
