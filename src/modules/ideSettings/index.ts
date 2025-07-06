import os from 'os';
import fs from 'fs';
import path from 'path';
import type { IDESettings } from '../../types';

function getFirstExistingPath(candidates: string[]): string | null {
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function getVSCodeSettingsPaths(): {
  global: string | null;
  workspace: string | null;
} {
  const home = os.homedir();
  const cwd = process.cwd();

  const globalPaths = [
    `${home}/Library/Application Support/Code/User/settings.json`, // macOS
    `${home}/.config/Code/User/settings.json`, // Linux
    `${home}/AppData/Roaming/Code/User/settings.json`, // Windows
  ];

  const workspacePath = path.join(cwd, '.vscode', 'settings.json');

  return {
    global: getFirstExistingPath(globalPaths),
    workspace: fs.existsSync(workspacePath) ? workspacePath : null,
  };
}

function getCursorSettingsPaths(): {
  global: string | null;
  workspace: string | null;
} {
  const home = os.homedir();

  const globalPaths = [
    `${home}/Library/Application Support/Cursor/User/settings.json`, // macOS
    `${home}/.config/Cursor/User/settings.json`, // Linux
    `${home}/AppData/Roaming/Cursor/User/settings.json`, // Windows
  ];

  return {
    global: getFirstExistingPath(globalPaths),
    workspace: null,
  };
}

function getIDESettingsPath(ide: string = 'vscode'): {
  global: string | null;
  workspace: string | null;
} {
  switch (ide.toLowerCase()) {
    case 'vscode':
      return getVSCodeSettingsPaths();
    case 'cursor':
      return getCursorSettingsPaths();
    default:
      return {
        global: null,
        workspace: null,
      };
  }
}

function loadSettingsFile(filePath: string): Record<string, unknown> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function mergeSettings(
  global: Record<string, unknown>,
  workspace: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...global };

  for (const [key, workspaceValue] of Object.entries(workspace)) {
    const globalValue = merged[key];

    if (workspaceValue === null || workspaceValue === undefined) {
      // 明确设置为 null/undefined 时删除设置
      delete merged[key];
    } else if (Array.isArray(workspaceValue)) {
      // 数组直接覆盖
      merged[key] = workspaceValue;
    } else if (
      typeof workspaceValue === 'object' &&
      workspaceValue !== null &&
      typeof globalValue === 'object' &&
      globalValue !== null &&
      !Array.isArray(globalValue)
    ) {
      // 对象类型深度合并
      merged[key] = mergeSettings(
        globalValue as Record<string, unknown>,
        workspaceValue as Record<string, unknown>
      );
    } else {
      // 基本类型直接覆盖
      merged[key] = workspaceValue;
    }
  }

  return merged;
}

export function getIDESettings(ide: string = 'vscode'): IDESettings {
  const { global: globalPath, workspace: workspacePath } =
    getIDESettingsPath(ide);

  const globalSettings = globalPath ? loadSettingsFile(globalPath) : {};
  const workspaceSettings = workspacePath
    ? loadSettingsFile(workspacePath)
    : {};
  const mergedSettings = mergeSettings(globalSettings, workspaceSettings);

  return mergedSettings;
}
