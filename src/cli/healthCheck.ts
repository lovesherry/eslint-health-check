import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { generateMarkdownReport } from '../reporters/markdownReporter';
import type { IDEType } from '../types';

export async function runHealthCheck(args: string[]): Promise<void> {
  const program = new Command();
  program
    .name('eslint-health-check')
    .description('全面检测 ESLint 配置健康状况')
    .option('--ide <ide>', '指定当前 IDE (vscode/webstorm)', 'vscode')
    .option('--mcp', '输出机器可解析的 JSON')
    .option('--markdown', '输出格式化 Markdown 报告')
    .option('--json', '输出原始诊断 JSON 数据')
    .option('--fix-simulate', '模拟 ESLint --fix，展示可自动修复的配置')
    .parse(args);

  const opts: { ide: IDEType } = program.opts();
  const currentIDE = opts.ide || 'vscode';
  // 生成 Markdown 报告
  const md = await generateMarkdownReport(currentIDE);

  // 输出到文件
  const reportDir = path.join(process.cwd(), 'eslint-health-check');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'report.md');
  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`✅ 健康检查报告已生成: ${reportPath}`);
}
