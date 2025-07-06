import * as fs from 'fs';
import * as path from 'path';
import { FileExtType } from '../types';

export const TMP_TYPES: FileExtType[] = ['.js', '.ts', '.jsx', '.tsx', '.vue'];
const TMP_FILES = TMP_TYPES.map((ext) => ({
  ext,
  name: `index${ext}`,
}));

export function createTmpFilesForTypes(
  dir: string = path.join(process.cwd(), 'eslint-health-check'),
  extensions?: string[]
) {
  fs.mkdirSync(dir, { recursive: true });

  const typesToCreate = extensions
    ? TMP_FILES.filter((t) => extensions.includes(t.ext))
    : TMP_FILES;

  const files = typesToCreate.map((t) => {
    const filePath = path.join(dir, t.name);
    fs.writeFileSync(filePath, '// temp file for config analysis');
    return { ...t, filePath };
  });
  return files;
}

export function cleanupTmpFiles(files: { filePath: string }[]) {
  for (const { filePath } of files) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
