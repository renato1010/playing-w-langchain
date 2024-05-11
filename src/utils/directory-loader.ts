import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from '@langchain/core/documents';

async function getDocsFromDirectory(dirPath: string): Promise<Document<Record<string, any>>[]> {
  const loader = new DirectoryLoader(dirPath, {
    '.txt': (path) => new TextLoader(path),
    '.md': (path) => new TextLoader(path),
    '.pdf': (path) => new PDFLoader(path)
  });
  const docs = await loader.load();
  console.log({ docs });
  return docs;
}

export { getDocsFromDirectory };
