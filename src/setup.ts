import path from 'node:path';
import { pineconeIndexDocs } from '@/utils/pinecone-utils.js';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { fileURLToPath } from 'node:url';

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const docsFolderPath = path.join(_dirname, '../documents');
export async function setup() {
  // console.log({ docsFolderPath });
  const loader = new DirectoryLoader(docsFolderPath, {
    '.txt': (path) => new TextLoader(path),
    '.md': (path) => new TextLoader(path),
    '.pdf': (path) => new PDFLoader(path)
  });

  const docs = await loader.load();

  try {
    await pineconeIndexDocs(docs);
  } catch (err) {
    console.log('error: ', err);
  }

  return {
    data: 'successfully created index and loaded data into pinecone...'
  };
}

await setup();
