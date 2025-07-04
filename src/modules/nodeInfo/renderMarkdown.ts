import { getNodeEnvironmentInfo } from '.';
import type { NodeVersionInfo } from '../../types';

function render(nodeInfo: NodeVersionInfo): string {
  return [
    '## Node 环境',
    `- **Node 版本**: ${nodeInfo.version}`,
    `- **平台**: ${nodeInfo.platform}`,
    `- **架构**: ${nodeInfo.arch}`,
    `- **Node 路径**: ${nodeInfo.nodePath}`,
    '',
    '---',
    '',
  ].join('\n');
}

export function renderNodeInfo() {
  const nodeInfo = getNodeEnvironmentInfo();
  return render(nodeInfo);
}
