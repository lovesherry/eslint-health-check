import os from 'os';
import fs from 'fs';
import path from 'path';
import type { IDEExtensionInfo, PackageJson } from '../../types';

function checkExtensionInDir(
  ide: string,
  extDir: string,
  extName: string,
  matchMode: 'prefix' | 'includes' = 'prefix'
): IDEExtensionInfo {
  const result: IDEExtensionInfo = {
    ide,
    extension: extName,
    status: 'not-installed',
  };
  if (!fs.existsSync(extDir)) return result;
  const found = fs
    .readdirSync(extDir)
    .find((name) =>
      matchMode === 'prefix'
        ? name.toLowerCase().startsWith(extName.toLowerCase())
        : name.toLowerCase().includes(extName.toLowerCase())
    );
  if (found) {
    const extPath = path.join(extDir, found);
    const pkgPath = path.join(extPath, 'package.json');
    let pkgName: string | undefined = undefined;
    let pkgPublisher: string | undefined = undefined;
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(
          fs.readFileSync(pkgPath, 'utf-8')
        ) as PackageJson;
        pkgName = pkg.name;
        pkgPublisher = pkg.publisher;
        result.version = pkg.version;
      } catch (error) {
        console.error(error);
      }
    }
    if (
      pkgPublisher &&
      pkgName &&
      `${pkgPublisher}.${pkgName}`.toLowerCase() === extName.toLowerCase() &&
      found.toLowerCase().startsWith(extName.toLowerCase())
    ) {
      result.status = 'maybe-installed';
    }
  }
  return result;
}

function checkExtensionInDirs(
  ide: string,
  dirs: string[],
  extName: string,
  matchMode: 'prefix' | 'includes' = 'prefix'
): IDEExtensionInfo {
  for (const dir of dirs) {
    const info = checkExtensionInDir(ide, dir, extName, matchMode);
    if (info.status === 'maybe-installed') return info;
  }
  // 全部未找到
  return { ide, extension: extName, status: 'not-installed' };
}

function getVSCodeExtensionsDirs(): string[] {
  const home = os.homedir();
  return [
    `${home}/.vscode/extensions`,
    `${home}/.vscode-server/extensions`,
    `${home}/.vscode-oss/extensions`,
    `${home}/.vscode-test/extensions`,
    `${home}/.vscode-insiders/extensions`,
    `${home}/.vscode-remote/extensions`,
  ];
}

function getWebStormPluginsDirs(): string[] {
  const home = os.homedir();
  const jetbrainsDir = `${home}/.local/share/JetBrains`;
  if (!fs.existsSync(jetbrainsDir)) return [];
  const dirs = fs
    .readdirSync(jetbrainsDir)
    .filter((dir) => dir.toLowerCase().includes('webstorm'))
    .map((dir) => path.join(jetbrainsDir, dir, 'plugins'))
    .filter(fs.existsSync);
  return dirs;
}

function getCursorExtensionsDir(): string[] {
  const home = os.homedir();
  return [`${home}/.cursor/extensions`];
}

export function analyzeIDEExtensions(
  ide: string = 'vscode'
): IDEExtensionInfo[] {
  if (ide.toLowerCase() === 'vscode') {
    const dirs = getVSCodeExtensionsDirs();
    return [
      checkExtensionInDirs('VSCode', dirs, 'dbaeumer.vscode-eslint', 'prefix'),
      checkExtensionInDirs('VSCode', dirs, 'esbenp.prettier-vscode', 'prefix'),
      checkExtensionInDirs(
        'VSCode',
        dirs,
        'editorconfig.editorconfig',
        'prefix'
      ),
    ] as IDEExtensionInfo[];
  }
  if (ide.toLowerCase() === 'webstorm') {
    const dirs = getWebStormPluginsDirs();
    return [
      checkExtensionInDirs('WebStorm', dirs, 'eslint', 'includes'),
      checkExtensionInDirs('WebStorm', dirs, 'prettier', 'includes'),
    ] as IDEExtensionInfo[];
  }
  if (ide.toLowerCase() === 'cursor') {
    const dirs = getCursorExtensionsDir();
    return [
      checkExtensionInDirs('Cursor', dirs, 'dbaeumer.vscode-eslint', 'prefix'),
      checkExtensionInDirs('Cursor', dirs, 'esbenp.prettier-vscode', 'prefix'),
      checkExtensionInDirs(
        'Cursor',
        dirs,
        'editorconfig.editorconfig',
        'prefix'
      ),
    ] as IDEExtensionInfo[];
  }
  // 可扩展更多 IDE/插件
  return [] as IDEExtensionInfo[];
}
