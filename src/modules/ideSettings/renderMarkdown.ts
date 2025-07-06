import type { IDESettings } from '../../types';

export function renderIDESettings(categories: IDESettings): string {
  let md = `## IDE 配置\n`;
  if (categories) {
    md += '```json\n';
    md += JSON.stringify(categories, null, 2) + '\n';
    md += '```\n';
  } else {
    md += '- 未检测到相关配置\n';
  }
  md += '\n---\n';
  return md;
}
