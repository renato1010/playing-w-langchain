import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function getESMFilePath(relativePath: string) {
  const _dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.join(_dirname, relativePath);
}

export { getESMFilePath };
