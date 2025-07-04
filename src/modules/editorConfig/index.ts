import * as fs from 'fs';
import * as path from 'path';
import { analyzeIDEExtensions } from '../ideExtensions';
import { getIDESettingsCategories } from '../ideSettings';
import type { EditorConfigAnalysis } from '../../types';

export function analyzeEditorConfig(
  ide: string = 'vscode'
): EditorConfigAnalysis {
  const cwd = process.cwd();
  const configPath = path.join(cwd, '.editorconfig');
  const exists = fs.existsSync(configPath);
  let content: string | null = null;
  if (exists) {
    content = fs.readFileSync(configPath, 'utf-8');
  }
  // 检查 IDE 是否安装 editorconfig 插件
  const extensions = analyzeIDEExtensions(ide);
  const extensionStatus = extensions.find((ext) => {
    const extName = ext.extension;
    return (
      typeof extName === 'string' &&
      extName.toLowerCase().includes('editorconfig')
    );
  })?.status;
  const extensionInstalled = extensionStatus === 'maybe-installed';
  // 检查 IDE settings 是否启用 detectIndents
  const settings = getIDESettingsCategories(ide);
  let detectIndentsEnabled = true;
  if (settings && settings.editor) {
    detectIndentsEnabled = settings.editor['detectIndentation'] !== false;
  }
  // 只有文件存在、插件 maybe-installed、detectIndents 启用才算生效
  const effective = exists && extensionInstalled && detectIndentsEnabled;
  return {
    exists,
    content,
    extensionInstalled,
    detectIndentsEnabled,
    effective,
  };
}
