import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

async function getDocsFromDirectory(dirPath: string) {
  const _dirname = path.dirname(fileURLToPath(import.meta.url));
  const docsFolderPath = path.join(_dirname, dirPath);
  const loader = new DirectoryLoader(docsFolderPath, {
    '.txt': (path) => new TextLoader(path),
    '.md': (path) => new TextLoader(path),
    '.pdf': (path) => new PDFLoader(path)
  });
  const docs = await loader.load();
  return docs;
}

export { getDocsFromDirectory };
