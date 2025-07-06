import type { NodeVersionInfo } from '../../types';

export function renderNodeInfo(nodeInfo: NodeVersionInfo): string {
  return [
    '## 项目 配置',
    `- **Node 版本**: ${nodeInfo.version}`,
    `- **平台**: ${nodeInfo.platform}`,
    `- **架构**: ${nodeInfo.arch}`,
    `- **Node 路径**: ${nodeInfo.nodePath}`,
    '',
    '---',
    '',
  ].join('\n');
}
