import { analyzeDepCompatibility } from '.';
import type { PluginCompatInfo } from '../../types';

function render(pluginResults: PluginCompatInfo[]): string {
  let md = '## ESLint 相关插件兼容性检测\n';
  for (const { name, version, compatible, issues } of pluginResults) {
    md += `\n### 插件: \`${name}@${version}\``;
    if (compatible) {
      md += '\n- ✅ 兼容\n';
    } else {
      md += '\n- ❌ 存在兼容性问题：\n';
      for (const issue of issues) {
        md += `  - ${issue}\n`;
      }
    }
  }
  return md;
}

export function renderDepCompatibility() {
  const pluginResults = analyzeDepCompatibility();
  return render(pluginResults);
}
