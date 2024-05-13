import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter, TextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { pineconeKey } from '@/env-vars.js';
import { openAIEmbeddings } from './embeddings-utils.js';
import { indexName as configuredName, timeout } from '@/utils/config.js';

export const pineconeClient = new Pinecone({ apiKey: pineconeKey });

export const createPineconeIndex = async (
  client: Pinecone,
  indexName = configuredName,
  vectorDimension = 1536
) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);
  // 2. Get list of existing indexes
  const indexList = await client.listIndexes();
  // 3. If index doesn't exist, create it
  if (!indexList.indexes?.map((indexModel) => indexModel.name).includes(indexName)) {
    // 4. Log index creation initiation
    console.log(`Creating "${indexName}"...`);
    // 5. Create index
    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: 'cosine',
      spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
    });
    // 6. Log successful creation
    console.log(`Creating index.... please wait for it to finish initializing.`);
    // 7. Wait for index initialization
    await new Promise((resolve) => setTimeout(resolve, timeout));
  } else {
    // 8. Log if index already exists
    console.log(`"${indexName}" already exists.`);
  }
};

export const pineconeIndexDocs = async (
  docs: Document<Record<string, any>>[],
  client: Pinecone = pineconeClient,
  indexName = configuredName
) => {
  console.log('Retrieving Pinecone index...');
  // 1. Retrieve Pinecone index
  const pineconeIndex = client.Index(indexName);
  // 2. Log the retrieved index name
  console.log(`Pinecone index retrieved: ${indexName}`);
  // 3. Create RecursiveCharacterTextSplitter instance
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });
  try {
    // 4. get splitted docs
    const splittedDocs = await textSplitter.splitDocuments(docs);
    // 5. embed docs and store in pinecone
    const pineconeStore = await PineconeStore.fromDocuments(splittedDocs, openAIEmbeddings(), {
      pineconeIndex,
      maxConcurrency: 5
    });
  } catch (error) {
    throw new Error('Error indexing docs in pinecone');
  }
};
