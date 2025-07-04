import { analyzeEditorConfig } from './index';
import type { EditorConfigAnalysis } from '../../types';

function render(result: EditorConfigAnalysis): string {
  let md = '## .editorconfig 检测\n';
  if (!result.exists) {
    md += '- 未检测到 .editorconfig 文件\n---\n';
    return md;
  }
  md += '- **.editorconfig 内容**:\n';
  md += '```ini\n';
  md += result.content + '\n';
  md += '```\n';
  md += `- **插件已安装**: ${result.extensionInstalled ? '✅' : '❌'}\n`;
  md += `- **detectIndentation 启用**: ${result.detectIndentsEnabled ? '✅' : '❌'}\n`;
  md += `- **配置是否生效**: ${result.effective ? '✅ 已生效' : '❌ 未生效'}\n`;
  md += '\n---\n';
  return md;
}

export function renderEditorConfigMarkdown(ide: string) {
  const result = analyzeEditorConfig(ide);
  return render(result);
}
