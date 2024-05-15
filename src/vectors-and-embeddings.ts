import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { similarity } from 'ml-distance';
import { openaiKey } from './env-vars.js';
import { splittedDocs } from './loading-preparing-data.js';

const embeddings = new OpenAIEmbeddings({ apiKey: openaiKey, model: 'text-embedding-3-large' });
const embeddedQuery = await embeddings.embedQuery('What is the capital of France?');
// console.log({ embeddedQuery, length: embeddedQuery.length });
const vector1 = await embeddings.embedQuery('What are vectors useful for in machine learning?');
const unrelatedVector = await embeddings.embedQuery('A group of parrots is called a pendemonium');

const distance1 = similarity.cosine(vector1, unrelatedVector);
const similarVector = await embeddings.embedQuery('Vectors are representations of information.');
const distance2 = similarity.cosine(vector1, similarVector);

// console.log({ distance1, distance2 });

const vectorStore = new MemoryVectorStore(embeddings);
// add documents to the vector store
await vectorStore.addDocuments(splittedDocs);
// retrieve documents from the vector store
const retrievedDocs = await vectorStore.similaritySearch('What is deep learning?', 4);

const pageContents = retrievedDocs.map((doc) => doc.pageContent);
// console.log({ pageContents });

export const retriever = vectorStore.asRetriever();
const relevantChunks = await retriever.invoke('What is deep learning?');
// console.log({ relevantChunks });
