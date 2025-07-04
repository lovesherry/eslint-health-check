import fs from 'fs';
import semver from 'semver';
import { findEslintConfigFile } from '../../utils/eslintConfigUtil';
import type { ConfigFormatResult, PackageJson } from '../../types';

const supportedConfigs = [
  'eslint.config.js',
  'eslint.config.mjs',
  '.eslintrc',
  '.eslintrc.json',
  '.eslintrc.js',
];

function getEslintVersion(): string {
  try {
    const eslintPkg = JSON.parse(
      fs.readFileSync(
        require.resolve('eslint/package.json', { paths: [process.cwd()] }),
        'utf-8'
      )
    ) as PackageJson;
    return eslintPkg.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

export function analyzeEslintConfigFormat(): ConfigFormatResult {
  const eslintVersion = getEslintVersion();
  const { configType, configFile, configFilePath } = findEslintConfigFile();
  const configFiles = supportedConfigs.map((name) => ({
    name,
    exists: fs.existsSync(name),
  }));
  const issues: string[] = [];
  let compatible = true;

  if (configType === 'flat') {
    // Flat config 仅支持 ESLint >=9
    if (
      eslintVersion === 'unknown' ||
      !semver.satisfies(eslintVersion, '>=9.0.0')
    ) {
      issues.push(
        '检测到使用 Flat 配置（eslint.config.js/mjs），但 ESLint 版本低于 9，可能不兼容。'
      );
      compatible = false;
    }
  } else if (configType === 'eslintrc') {
    // 传统配置在 ESLint >=9 时会被弃用
    if (
      eslintVersion !== 'unknown' &&
      semver.satisfies(eslintVersion, '>=9.0.0')
    ) {
      issues.push(
        '检测到使用传统配置（.eslintrc*），但 ESLint 版本为 9 及以上，建议迁移到 Flat 配置。'
      );
      compatible = false;
    }
  } else {
    issues.push('未检测到有效的 ESLint 配置文件。');
    compatible = false;
  }

  return {
    eslintVersion,
    configType,
    configFile,
    configFilePath,
    configFiles,
    compatible,
    issues,
  };
}
