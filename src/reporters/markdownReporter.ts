import { renderDepCompatibility } from '../modules/dependenciesAnalyze/renderMarkdown';
import { renderEditorConfigMarkdown } from '../modules/editorConfig/renderMarkdown';
import { renderEslintConfigFormat } from '../modules/eslintConfig/renderMarkdown';
import { renderEslintRules } from '../modules/eslintRules/renderMarkdown';
import { renderIDEExtensions } from '../modules/ideExtensions/renderMarkdown';
import { renderIDESettings } from '../modules/ideSettings/renderMarkdown';
import { renderNodeInfo } from '../modules/nodeInfo/renderMarkdown';
import { renderPrettierConfig } from '../modules/prettierConfig/renderMarkdown';

export async function generateMarkdownReport(ide: string): Promise<string> {
  return [
    '# 🩺 ESLint 健康检查报告',
    '',
    renderNodeInfo(),
    renderIDEExtensions(ide),
    renderIDESettings(ide),
    renderEditorConfigMarkdown(ide),
    renderEslintConfigFormat(),
    await renderEslintRules(),
    await renderPrettierConfig(),
    renderDepCompatibility(),
  ].join('\n');
}
