import path from 'path';
import fs from 'fs';
import { ESLint } from 'eslint';

function checkEslintInstalled(nodeModules: string): boolean {
  const eslintPath = path.join(nodeModules, 'eslint');
  return fs.existsSync(eslintPath);
}

export function hasEslint() {
  const nodeModules = path.resolve('node_modules');
  return checkEslintInstalled(nodeModules);
}

export function getEslintClass(): typeof ESLint | null {
  try {
    const eslintModule = require(
      require.resolve('eslint', { paths: [process.cwd()] })
    ) as { ESLint: typeof ESLint };
    if (eslintModule && typeof eslintModule.ESLint === 'function') {
      return eslintModule.ESLint;
    }
    throw new Error('ESLint module does not export ESLint class');
  } catch (error) {
    console.error(error);
    return null;
  }
}
