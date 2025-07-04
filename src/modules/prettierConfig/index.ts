import fs from 'fs';
import path from 'path';
import type { Options as PrettierOptions } from 'prettier';
import {
  createTmpFilesForTypes,
  cleanupTmpFiles,
} from '../../utils/tmpFileUtil';
import type { PrettierConfigByType } from '../../types';

export async function aggregatePrettierConfigByType(): Promise<
  PrettierConfigByType[]
> {
  try {
    const prettierPath = require.resolve('prettier', {
      paths: [process.cwd()],
    });
    const prettier = require(prettierPath) as typeof import('prettier');
    const tmpFiles = createTmpFilesForTypes();
    const results: PrettierConfigByType[] = [];
    const outputDir = path.join(process.cwd(), 'eslint-health-check');
    fs.mkdirSync(outputDir, { recursive: true });
    for (const { ext, filePath } of tmpFiles) {
      const config: PrettierOptions | null =
        await prettier.resolveConfig(filePath);
      results.push({ fileType: ext, filePath, prettierConfig: config });
      if (config) {
        const jsonFile = path.join(outputDir, `prettier-for-${ext}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(config, null, 2), 'utf-8');
      }
    }
    cleanupTmpFiles(tmpFiles);
    return results;
  } catch (e) {
    console.error('Error analyzing Prettier rules:', e);
    return [];
  }
}
