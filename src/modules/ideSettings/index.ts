import os from 'os';
import fs from 'fs';

function getFirstExistingPath(candidates: string[]): string | null {
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function parseSettingsToCategories(
  settings: Record<string, unknown>
): Record<string, Record<string, unknown>> {
  const categories: Record<string, Record<string, unknown>> = {
    eslint: {},
    prettier: {},
    typescript: {},
    javascript: {},
    editor: {},
  };
  for (const key of Object.keys(settings)) {
    if (/^eslint\./i.test(key)) categories.eslint[key] = settings[key];
    else if (/^prettier\./i.test(key)) categories.prettier[key] = settings[key];
    else if (/^typescript\./i.test(key))
      categories.typescript[key] = settings[key];
    else if (/^javascript\./i.test(key))
      categories.javascript[key] = settings[key];
    else if (/^editor\./i.test(key)) categories.editor[key] = settings[key];
  }
  return categories;
}

function getIDESettingsPath(ide: string): string | null {
  const home = os.homedir();
  if (ide.toLowerCase() === 'vscode') {
    return getFirstExistingPath([
      `${home}/Library/Application Support/Code/User/settings.json`,
      `${home}/.config/Code/User/settings.json`,
      `${home}/AppData/Roaming/Code/User/settings.json`,
      `${home}/.vscode/settings.json`,
    ]);
  }
  if (ide.toLowerCase() === 'webstorm') {
    return getFirstExistingPath([
      `${home}/.config/JetBrains/WebStorm2023.1/options/ide.general.xml`,
      `${home}/.local/share/JetBrains/WebStorm2023.1/options/ide.general.xml`,
      // 可补充更多版本
    ]);
  }
  if (ide.toLowerCase() === 'cursor') {
    return getFirstExistingPath([
      `${home}/Library/Application Support/Cursor/User/settings.json`,
      `${home}/.config/Cursor/User/settings.json`,
      `${home}/AppData/Roaming/Cursor/User/settings.json`,
      `${home}/.cursor/settings.json`,
    ]);
  }
  return null;
}

export function getIDESettingsCategories(
  ide: string = 'vscode'
): Record<string, Record<string, unknown>> | null {
  const settingsPath = getIDESettingsPath(ide);
  if (!settingsPath) return null;
  try {
    const settings = JSON.parse(
      fs.readFileSync(settingsPath, 'utf-8')
    ) as Record<string, unknown>;
    return parseSettingsToCategories(settings);
  } catch {
    return null;
  }
}
