import path from 'path';
import fs from 'fs';
import { ESLint } from 'eslint';
import type { Linter } from 'eslint';
import {
  createTmpFilesForTypes,
  cleanupTmpFiles,
} from '../../utils/tmpFileUtil';
import type { FileRuleAnalysis, RuleUsage } from '../../types';

function getRuleStatus(value: (string | number)[]): 'off' | 'on' | 'warn' {
  let _value = value[0];
  if (_value === 'off' || _value === 0) return 'off';
  if (_value === 'warn' || _value === 1) return 'warn';
  return 'on';
}

export async function aggregateEslintRulesWithAPI(): Promise<
  FileRuleAnalysis[]
> {
  let ESLintClass: typeof ESLint;
  try {
    const eslintModule = require(
      require.resolve('eslint', { paths: [process.cwd()] })
    ) as { ESLint: typeof ESLint };
    if (eslintModule && typeof eslintModule.ESLint === 'function') {
      ESLintClass = eslintModule.ESLint;
    } else {
      throw new Error('ESLint module does not export ESLint class');
    }
  } catch (error) {
    console.error(error);
    throw new Error('未检测到项目依赖 eslint，请先在项目中安装 eslint。');
  }
  // 使用公共工具创建临时文件
  const tmpFiles = createTmpFilesForTypes();
  const eslint = new ESLintClass();
  const results: FileRuleAnalysis[] = [];
  const outputDir = path.join(process.cwd(), 'eslint-health-check');
  fs.mkdirSync(outputDir, { recursive: true });
  for (const { ext, filePath } of tmpFiles) {
    let config: Linter.Config | null = null;
    try {
      config = (await eslint.calculateConfigForFile(filePath)) as Linter.Config;
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorResult: FileRuleAnalysis = {
          fileType: ext,
          filePath,
          rules: [
            {
              name: 'config-error',
              status: 'off',
              value: [e.message],
            },
          ],
        };
        results.push(errorResult);
        fs.writeFileSync(
          path.join(outputDir, `eslint-rules-for-${ext}.json`),
          JSON.stringify(errorResult.rules, null, 2),
          'utf-8'
        );
        continue;
      }
    }
    if (!config) {
      const errorResult: FileRuleAnalysis = {
        fileType: ext,
        filePath,
        rules: [
          {
            name: 'config-error',
            status: 'off',
            value: ['ESLint config is undefined'],
          },
        ],
      };
      results.push(errorResult);
      fs.writeFileSync(
        path.join(outputDir, `eslint-rules-for-${ext}.json`),
        JSON.stringify(errorResult.rules, null, 2),
        'utf-8'
      );
      continue;
    }
    const rules = (config.rules ?? {}) as Record<string, Linter.RuleEntry>;
    const ruleList: RuleUsage[] = [];
    for (const [name, value] of Object.entries(rules)) {
      if (typeof value === 'undefined') continue;
      const arrValue = Array.isArray(value) ? value : [value];
      ruleList.push({
        name,
        status: getRuleStatus(arrValue as (string | number)[]),
        value: arrValue as (string | number)[],
      });
    }
    const fileResult: FileRuleAnalysis = {
      fileType: ext,
      filePath,
      rules: ruleList,
    };
    results.push(fileResult);
    fs.writeFileSync(
      path.join(outputDir, `eslint-rules-for-${ext}.json`),
      JSON.stringify(ruleList, null, 2),
      'utf-8'
    );
  }
  // 删除临时文件
  cleanupTmpFiles(tmpFiles);
  return results;
}
