import type { DepAnalysisResult } from '../../types';

export function renderDepCompatibility(
  analysisResult: DepAnalysisResult
): string {
  let md = '## ESLint 相关依赖兼容性检测\n';

  if (!analysisResult.useEslint) {
    md += '- ❌ ESLint 未安装，跳过依赖分析\n';
    return md;
  }

  for (const { name, version, compatible, issues } of analysisResult.issues) {
    md += `\n### \`${name}@${version}\``;
    if (compatible) {
      md += '- ✅ 兼容';
    } else {
      md += '\n- ❌ 存在兼容性问题：\n';
      for (const issue of issues) {
        md += `  - ${issue}\n`;
      }
    }
  }
  return md;
}
