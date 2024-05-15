import { openaiKey } from '@/env-vars.js';
import { ChatOpenAI } from '@langchain/openai';

export const openAIChatModel = new ChatOpenAI({
  model: 'gpt-4-0125-preview',
  temperature: 0,
  apiKey: openaiKey
});

export const getOpenAIChatModel = (temperature = 0, model = 'gpt-4-0125-preview') => {
  return new ChatOpenAI({
    model,
    temperature,
    apiKey: openaiKey
  });
};
