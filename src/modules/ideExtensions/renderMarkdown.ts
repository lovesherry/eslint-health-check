import { analyzeIDEExtensions } from '.';
import type { IDEExtensionInfo } from '../../types';

function render(ideResults: IDEExtensionInfo[]): string {
  if (!ideResults.length) return '## IDE 插件检测\n- 未检测到相关插件\n---\n';
  let md = '## IDE 插件检测\n';
  const grouped = ideResults.reduce(
    (acc, cur) => {
      acc[cur.ide] = acc[cur.ide] || [];
      acc[cur.ide].push(cur);
      return acc;
    },
    {} as Record<string, IDEExtensionInfo[]>
  );
  for (const ide of Object.keys(grouped)) {
    md += `\n### ${ide}\n\n`;
    for (const info of grouped[ide]) {
      md += `- **插件名称**: ${info.extension ?? '未知'}${info.version ? `@${info.version}` : ''}\n`;
      if (info.status === 'maybe-installed') {
        md += `- **状态**: 检测到扩展目录，可能已安装（仅供参考，建议在 VSCode 插件环境下检测准确状态）\n`;
      } else {
        md += `- **状态**: 未检测到扩展目录，可能未安装\n`;
      }
    }
  }
  md += '\n---\n\n';
  return md;
}

export function renderIDEExtensions(ide: string) {
  const ideResults = analyzeIDEExtensions(ide);
  return render(ideResults);
}
