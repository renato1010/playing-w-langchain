import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { openaiKey } from '../env-vars.js';

export function openAIEmbeddings(
  batchSize = 512,
  openaiEmbeddingsModel = 'text-embedding-3-small'
) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openaiKey,
    model: openaiEmbeddingsModel,
    batchSize: batchSize
  });
  return embeddings;
}
