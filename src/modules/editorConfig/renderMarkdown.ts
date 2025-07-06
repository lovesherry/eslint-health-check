export function renderEditorConfigMarkdown(result: string | null): string {
  let md = '## .editorconfig 检测\n';
  if (!result) {
    md += '- 未检测到 .editorconfig 文件\n---\n';
    return md;
  }
  md += '- **.editorconfig 内容**:\n';
  md += '```ini\n';
  md += result + '\n';
  md += '```\n';
  md += '\n---\n';
  return md;
}
