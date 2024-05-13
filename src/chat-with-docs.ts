import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { formatDocumentsAsString } from 'langchain/util/document';
import { pineconeClient as pcClient } from './utils/pinecone-utils.js';
import { indexName } from '@/utils/config.js';
import { openAIEmbeddings } from './utils/embeddings-utils.js';
import { openaiKey } from './env-vars.js';

async function askDocs(prompt: string, pineconeClient: Pinecone = pcClient) {
  const openAIChatModel = new ChatOpenAI({
    model: 'gpt-4-0125-preview',
    temperature: 0,
    apiKey: openaiKey
  });
  const pineconeIndex = pineconeClient.Index(indexName);
  const vectorStore = await PineconeStore.fromExistingIndex(openAIEmbeddings(), { pineconeIndex });
  const vectorStoreRetriever = vectorStore.asRetriever();
  const retrieverDocs = await vectorStoreRetriever.invoke(prompt);
  const chatPromptTemplate =
    PromptTemplate.fromTemplate(`Answer the question based only on the following context:
  {context}
  Question: {question}`);
  const outputParser = new StringOutputParser();
  const ragChain = chatPromptTemplate.pipe(openAIChatModel).pipe(outputParser);
  const result = await ragChain.invoke({
    context: formatDocumentsAsString(retrieverDocs),
    question: prompt
  });
  console.log({ result });
}

await askDocs('What is the lens protocol');