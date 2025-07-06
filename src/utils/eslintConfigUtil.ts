import * as fs from 'fs';
import * as path from 'path';

export type EslintConfigType = 'flat' | 'eslintrc' | 'unknown';

export interface EslintConfigFileInfo {
  configType: EslintConfigType;
  configFile: string | null;
  configFilePath: string | null;
  configContent: string | null; // must be string
}

const supportedConfigs = [
  { name: 'eslint.config.ts', type: 'flat' },
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
      let configContent: string | null = null;
      try {
        configContent = fs.readFileSync(absPath, 'utf-8');
      } catch (error) {
        console.warn(`Failed to read config file ${absPath}:`, error);
        configContent = null;
      }

      return {
        configType: cfg.type as EslintConfigType,
        configFile: cfg.name,
        configFilePath: absPath,
        configContent,
      };
    }
  }
  return {
    configType: 'unknown',
    configFile: null,
    configFilePath: null,
    configContent: null,
  };
}
