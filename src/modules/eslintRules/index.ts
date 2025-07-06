import path from 'path';
import fs from 'fs';
import type { Linter } from 'eslint';
import {
  createTmpFilesForTypes,
  cleanupTmpFiles,
} from '../../utils/tmpFileUtil';
import type { EslintRulesResult, RuleUsage } from '../../types';
import { getEslintClass } from '../../utils/eslintUtil';

function getRuleStatus(value: (string | number)[]): 'off' | 'on' | 'warn' {
  let _value = value[0];
  if (_value === 'off' || _value === 0) return 'off';
  if (_value === 'warn' || _value === 1) return 'warn';
  return 'on';
}

export async function aggregateEslintRulesWithAPI(): Promise<
  EslintRulesResult[]
> {
  let ESLintClass = getEslintClass();
  if (!ESLintClass) {
    return [];
  }
  // 使用公共工具创建临时文件
  const tmpFiles = createTmpFilesForTypes();
  const results: EslintRulesResult[] = tmpFiles.map((v) => ({
    ...v,
    errorMsg: '',
    rules: [],
  }));
  const eslint = new ESLintClass();
  const outputDir = path.join(process.cwd(), 'eslint-health-check');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const result of results) {
    const { ext, filePath } = result;
    let config: Linter.Config | null = null;

    try {
      config = (await eslint.calculateConfigForFile(filePath)) as Linter.Config;
    } catch (e: unknown) {
      result.errorMsg =
        e instanceof Error ? e.message : `Failed to analyze ${ext}`;
      continue;
    }
    if (!config) {
      result.errorMsg = 'Failed to fetch ESLint config for file';
      continue;
    }
    const rules: RuleUsage[] = [];
    const eslintRules = (config.rules ?? {}) as Record<
      string,
      Linter.RuleEntry
    >;
    for (const [name, value] of Object.entries(eslintRules)) {
      if (typeof value === 'undefined') continue;
      const arrValue = Array.isArray(value) ? value : [value];
      rules.push({
        name,
        status: getRuleStatus(arrValue as (string | number)[]),
        value: arrValue as (string | number)[],
      });
    }

    // 保存规则到文件
    fs.writeFileSync(
      path.join(outputDir, `eslint-rules-for-${ext.slice(1)}.json`),
      JSON.stringify(rules, null, 2),
      'utf-8'
    );
    result.rules = rules;
  }

  // 删除临时文件
  cleanupTmpFiles(tmpFiles);

  return results;
}
