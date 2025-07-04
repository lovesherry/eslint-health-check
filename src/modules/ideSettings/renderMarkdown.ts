import { getIDESettingsCategories } from './index';

function render(
  categories: Record<string, Record<string, unknown>> | null
): string {
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
export function renderIDESettings(ide: string): string {
  const categories = getIDESettingsCategories(ide);
  return render(categories);
}
