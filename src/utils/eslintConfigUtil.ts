import * as fs from 'fs';
import * as path from 'path';

export type EslintConfigType = 'flat' | 'eslintrc' | 'unknown';

export interface EslintConfigFileInfo {
  configType: EslintConfigType;
  configFile: string | null;
  configFilePath: string | null;
}

const supportedConfigs = [
  { name: 'eslint.config.js', type: 'flat' },
  { name: 'eslint.config.mjs', type: 'flat' },
  { name: '.eslintrc', type: 'eslintrc' },
  { name: '.eslintrc.json', type: 'eslintrc' },
  { name: '.eslintrc.js', type: 'eslintrc' },
];

export function findEslintConfigFile(
  baseDir: string = process.cwd()
): EslintConfigFileInfo {
  for (const cfg of supportedConfigs) {
    const absPath = path.join(baseDir, cfg.name);
    if (fs.existsSync(absPath)) {
      return {
        configType: cfg.type as EslintConfigType,
        configFile: cfg.name,
        configFilePath: absPath,
      };
    }
  }
  return { configType: 'unknown', configFile: null, configFilePath: null };
}
