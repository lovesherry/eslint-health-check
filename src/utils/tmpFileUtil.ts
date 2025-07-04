import * as fs from 'fs';
import * as path from 'path';

export const TMP_TYPES = [
  { ext: 'js', name: 'index.js' },
  { ext: 'ts', name: 'index.ts' },
  { ext: 'jsx', name: 'index.jsx' },
  { ext: 'tsx', name: 'index.tsx' },
  { ext: 'vue', name: 'index.vue' },
];

export function createTmpFilesForTypes(
  dir: string = path.join(process.cwd(), 'eslint-health-check')
) {
  fs.mkdirSync(dir, { recursive: true });
  const files = TMP_TYPES.map((t) => {
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
