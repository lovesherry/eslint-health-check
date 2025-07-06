import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { generateMarkdownReport } from '../reporters/markdown';
import {
  confirmEslintExtension,
  confirmPrettierExtension,
  selectIDE,
} from '../utils/inquirer';
import { getNodeEnvironmentInfo } from '../modules/nodeInfo';
import { analyzeDepCompatibility } from '../modules/dependenciesAnalyze';
import { checkPackageJsonVersions } from '../utils/versionCheck';
import { analyzeEslintConfigFormat } from '../modules/eslintConfig';
import { aggregateEslintRulesWithAPI } from '../modules/eslintRules';
import { aggregatePrettierConfig } from '../modules/prettierConfig';
import { analyzeEditorConfig } from '../modules/editorConfig';
import { getIDESettings } from '../modules/ideSettings';
import { initializeAnalyzer, analyzeHealthCheck } from '../llm/analyzer';
import { hasEslint } from '../utils/eslintUtil';
import { generateMarkdownReportForAI } from '../reporters/markdownForAI';

export async function runHealthCheck(): Promise<void> {
  const program = new Command();

  program
    .name('eslint-health-check')
    .description('ESLint 健康检查工具')
    .version('0.1.0')
    .option('-a, --ai-analysis', 'Enable AI analysis of health check results')
    .option('-j, --json', 'Output results as JSON file')
    .parse(process.argv);

  const options = program.opts();

  try {
    // 检查版本兼容性
    const versionCheck = checkPackageJsonVersions();
    if (!versionCheck.isValid) {
      console.log('❌ 版本兼容性检查失败:');
      console.log(versionCheck.issues.join('\n'));
      return;
    }

    // 检查 ESLint 是否安装
    const eslintCheck = hasEslint();
    if (!eslintCheck) {
      console.log('❌ 项目中未安装 ESLint');
      console.log('请先安装 ESLint: npm install eslint --save-dev');
      return;
    }

    // 用户交互
    const ide = await selectIDE();
    const hasEslintExtension =
      ide === 'cursor' ? true : await confirmEslintExtension();
    const hasPrettierExtension = await confirmPrettierExtension();

    // 执行健康检查
    const nodeInfo = getNodeEnvironmentInfo();
    const depCompatibility = analyzeDepCompatibility();
    const eslintConfigFormat = analyzeEslintConfigFormat();
    const eslintRules = await aggregateEslintRulesWithAPI();
    const prettierConfig = await aggregatePrettierConfig();
    const editorConfig = analyzeEditorConfig();
    const ideSettings = getIDESettings(ide);

    // 构建健康检查数据
    const healthCheckData = {
      nodeInfo,
      depCompatibility,
      eslintConfigFormat,
      eslintRules,
      prettierConfig,
      editorConfig,
      ideSettings,
      currentIDE: ide,
      hasEslintExtension,
      hasPrettierExtension,
    };

    // 生成 Markdown 报告
    let md = generateMarkdownReport(healthCheckData);

    // 检查 AI 分析选项
    if (options.aiAnalysis) {
      console.log('🤖 启用 AI 分析...');
      // AI 分析模式
      initializeAnalyzer(
        generateMarkdownReportForAI(md, {
          eslintConfig: eslintConfigFormat.configContent,
        })
      );

      // 执行 AI 分析
      const analysisResult = await analyzeHealthCheck();
      if (analysisResult.success) {
        console.log('\n🤖 AI 分析完成，结果已添加到报告中');

        // 将 AI 分析结果拼接到 Markdown 报告后面
        md += '\n\n# 🤖 AI 分析建议\n\n';
        md += analysisResult.text;
      } else {
        console.log('❌ AI 分析失败:', analysisResult.error);
        md += '\n\n# 🤖 AI 分析失败\n\n';
        md += analysisResult.error;
      }
    }

    // 输出 Markdown 报告
    const reportPath = path.join(
      process.cwd(),
      'eslint-health-check-report.md'
    );
    fs.writeFileSync(reportPath, md, 'utf-8');
    console.log(`✅ 健康检查报告已生成: ${reportPath}`);

    // 检查 JSON 输出选项
    if (options.json) {
      console.log('📄 生成 JSON 报告...');
      const jsonPath = path.join(
        process.cwd(),
        'eslint-health-check-report.json'
      );
      const jsonContent = JSON.stringify(healthCheckData, null, 2);
      fs.writeFileSync(jsonPath, jsonContent, 'utf-8');
      console.log(`✅ JSON 报告已生成: ${jsonPath}`);
    }
  } catch (error) {
    console.error('❌ 健康检查失败:', error);
    process.exit(1);
  }
}
