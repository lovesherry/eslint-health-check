import * as fs from 'fs';
import * as path from 'path';

export function analyzeEditorConfig(): string | null {
  const cwd = process.cwd();
  const configPath = path.join(cwd, '.editorconfig');
  let content: string | null = null;
  if (fs.existsSync(configPath)) {
    content = fs.readFileSync(configPath, 'utf-8');
  }
  return content;
}
