import fs from 'fs';
import semver from 'semver';
import type { PackageJson } from '../types';
import { getPkgJson } from './getPkgJson';

export interface VersionCheckResult {
  isValid: boolean;
  eslintVersion?: string;
  nodeVersion?: string;
  issues: string[];
}

export function checkPackageJsonVersions(): VersionCheckResult {
  const issues: string[] = [];
  let eslintVersion: string | undefined;
  let nodeVersion: string | undefined;

  try {
    // 读取当前项目的 package.json
    const packageJson = getPkgJson();
    if (!packageJson) {
      return {
        isValid: false,
        issues: ['package.json not found'],
      };
    }

    // 检查 peerDependencies 中的 eslint 版本
    if (packageJson.peerDependencies?.eslint) {
      const requiredEslintVersion = packageJson.peerDependencies.eslint;

      // 获取实际安装的 eslint 版本
      try {
        const eslintPkgPath = require.resolve('eslint/package.json', {
          paths: [process.cwd()],
        });
        const eslintPkg = JSON.parse(
          fs.readFileSync(eslintPkgPath, 'utf-8')
        ) as PackageJson;
        eslintVersion = eslintPkg.version;

        if (
          !semver.satisfies(eslintVersion, requiredEslintVersion, {
            includePrerelease: true,
          })
        ) {
          issues.push(
            `ESLint version ${eslintVersion} does not satisfy peerDependency requirement ${requiredEslintVersion}`
          );
        }
      } catch (error) {
        console.error(error);
        issues.push('Failed to check ESLint version compatibility');
      }
    }

    // 检查 engines.node 版本
    if (packageJson.engines?.node) {
      const requiredNodeVersion = packageJson.engines.node;
      nodeVersion = process.version;

      if (
        !semver.satisfies(nodeVersion, requiredNodeVersion, {
          includePrerelease: true,
        })
      ) {
        issues.push(
          `Node version ${nodeVersion} does not satisfy engines requirement ${requiredNodeVersion}`
        );
      }
    }
  } catch (error) {
    console.error(error);
    issues.push('Failed to read or parse package.json');
  }

  return {
    isValid: issues.length === 0,
    eslintVersion,
    nodeVersion,
    issues,
  };
}
