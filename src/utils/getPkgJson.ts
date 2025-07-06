import path from 'path';
import fs from 'fs';
import type { PackageJson } from '../types';

export function getPkgJson(pkgDir: string = process.cwd()): PackageJson | null {
  try {
    const pkgPath = path.join(pkgDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as PackageJson;
    }
  } catch {
    /* empty */
  }
  return null;
}
