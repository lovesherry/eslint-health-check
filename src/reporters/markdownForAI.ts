import { getPkgJson } from '../utils/getPkgJson';

export function generateMarkdownReportForAI(
  md: string,
  { eslintConfig }: { eslintConfig: string | null }
): string {
  const { dependencies, devDependencies } = getPkgJson() || {};

  return [
    '### 项目Package.json 依赖信息：',
    '',
    `\`\`\`json\n${JSON.stringify({ dependencies, devDependencies }, null, 2)}\n\`\`\``,
    '',
    '### ESLint 配置如下：',
    '',
    eslintConfig,
  ].join('\n');
}
