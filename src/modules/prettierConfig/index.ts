import fs from 'fs';
import path from 'path';
import type { Options as PrettierOptions } from 'prettier';
import {
  createTmpFilesForTypes,
  cleanupTmpFiles,
} from '../../utils/tmpFileUtil';
import type { PrettierConfigResult } from '../../types';

export async function aggregatePrettierConfig(): Promise<
  PrettierConfigResult[]
> {
  let prettier: typeof import('prettier') | null = null;

  try {
    const prettierPath = require.resolve('prettier', {
      paths: [process.cwd()],
    });
    prettier = require(prettierPath) as typeof import('prettier');
  } catch (e) {
    console.error('Error loading Prettier module:', e);
    return [];
  }

  if (!prettier) {
    return [];
  }

  // 使用公共工具创建临时文件
  const tmpFiles = createTmpFilesForTypes();
  const results: PrettierConfigResult[] = tmpFiles.map((v) => ({
    ...v,
    errorMsg: '',
    prettierConfig: null,
  }));

  const outputDir = path.join(process.cwd(), 'eslint-health-check');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const result of results) {
    const { ext, filePath } = result;
    let config: PrettierOptions | null = null;

    try {
      // 使用 prettier.resolveConfig 作为兜底逻辑
      config = await prettier.resolveConfig(filePath);
    } catch (e: unknown) {
      result.errorMsg =
        e instanceof Error ? e.message : `Failed to analyze ${ext}`;
      continue;
    }

    if (!config) {
      result.errorMsg = 'Failed to fetch Prettier';
      continue;
    }

    result.prettierConfig = config;
  }

  // 删除临时文件
  cleanupTmpFiles(tmpFiles);

  return results;
}
