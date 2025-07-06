import { renderDepCompatibility } from '../modules/dependenciesAnalyze/renderMarkdown';
import { renderEditorConfigMarkdown } from '../modules/editorConfig/renderMarkdown';
import { renderEslintConfigFormat } from '../modules/eslintConfig/renderMarkdown';
import { renderEslintRules } from '../modules/eslintRules/renderMarkdown';
import { renderIDEExtensions } from '../modules/ideExtensions/renderMarkdown';
import { renderIDESettings } from '../modules/ideSettings/renderMarkdown';
import { renderNodeInfo } from '../modules/nodeInfo/renderMarkdown';
import { renderPrettierConfig } from '../modules/prettierConfig/renderMarkdown';
import { HealthCheckData } from '../types';

export function generateMarkdownReport(
  healthCheckData: HealthCheckData
): string {
  const {
    nodeInfo,
    depCompatibility,
    eslintConfigFormat,
    eslintRules,
    prettierConfig,
    editorConfig,
    ideSettings,
  } = healthCheckData;

  return [
    '# 🩺 ESLint 健康检查报告',
    '',
    renderNodeInfo(nodeInfo),
    renderIDESettings(ideSettings),
    renderIDEExtensions(healthCheckData),
    renderDepCompatibility(depCompatibility),
    renderEslintConfigFormat(eslintConfigFormat),
    renderEslintRules(eslintRules),
    renderPrettierConfig(prettierConfig),
    renderEditorConfigMarkdown(editorConfig),
  ].join('\n');
}
