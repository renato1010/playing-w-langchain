import { pineconeIndexDocs } from '@/utils/pinecone-utils.js';
import { getDocsFromDirectory } from './utils/directory-loader.js';

export async function setup() {
  const docs = await getDocsFromDirectory('../../documents');

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
