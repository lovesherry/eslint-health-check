import fs from 'fs';
import path from 'path';
import semver from 'semver';
import type { PackageJson, PluginCompatInfo } from '../../types';

function isEslintRelated(pkgName: string): boolean {
  return /eslint/i.test(pkgName);
}

function getAllNodeModulesDirs(baseDir: string): string[] {
  const dirs: string[] = [];
  if (!fs.existsSync(baseDir)) return dirs;
  for (const name of fs.readdirSync(baseDir)) {
    if (name.startsWith('.')) continue;
    const full = path.join(baseDir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name.startsWith('@')) {
        // scoped package
        for (const sub of fs.readdirSync(full)) {
          dirs.push(path.join(full, sub));
        }
      } else {
        dirs.push(full);
      }
    }
  }
  return dirs;
}

function getPkgJson(pkgDir: string): PackageJson | null {
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

export function analyzeDepCompatibility(): PluginCompatInfo[] {
  const nodeModules = path.resolve('node_modules');
  const allDirs = getAllNodeModulesDirs(nodeModules);
  const results: PluginCompatInfo[] = [];
  for (const dir of allDirs) {
    const pkg = getPkgJson(dir);
    if (!pkg || !isEslintRelated(pkg.name)) continue;
    const peer = pkg.peerDependencies || {};
    const engines = pkg.engines || {};
    const version = pkg.version || 'unknown';
    const issues: string[] = [];
    // 检查 peerDependencies 是否满足
    for (const dep in peer) {
      try {
        const depPkg = getPkgJson(path.join(nodeModules, dep));
        if (!depPkg) {
          issues.push(`缺少依赖 ${dep}`);
          continue;
        }
        const depVersion = semver.clean(depPkg.version);
        if (!depVersion) {
          issues.push(`${dep} 版本号格式无法识别: ${depPkg.version}`);
          continue;
        }
        if (
          !semver.satisfies(depVersion, peer[dep], { includePrerelease: true })
        ) {
          issues.push(`${dep} 版本 ${depPkg.version} 不满足要求 ${peer[dep]}`);
        }
      } catch {
        issues.push(`依赖 ${dep} 检查失败`);
      }
    }
    // 检查 engines.node
    if (engines.node) {
      const nodeVersion = semver.clean(process.version);
      if (!nodeVersion) {
        issues.push(`Node 版本号格式无法识别: ${process.version}`);
      } else if (
        !semver.satisfies(nodeVersion, engines.node, {
          includePrerelease: true,
        })
      ) {
        issues.push(`Node 版本 ${nodeVersion} 不满足要求 ${engines.node}`);
      }
    }
    results.push({
      name: pkg.name,
      version,
      peerDependencies: peer,
      engines,
      compatible: issues.length === 0,
      issues,
    });
  }
  return results;
}
