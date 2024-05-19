import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { openaiKey } from '@/env-vars.js';

export const openAIChatModel = new ChatOpenAI({
  model: 'gpt-4-turbo',
  temperature: 0,
  openAIApiKey: openaiKey
});

export const openaiLLM = new OpenAI({
  temperature: 0,
  model: 'gpt-4-turbo',
  openAIApiKey: openaiKey
});

export const getOpenAIChatModel = (temperature = 0, model = 'gpt-4-turbo') => {
  return new ChatOpenAI({
    model,
    temperature,
    openAIApiKey: openaiKey
  });
};

export const getOpenAILLM = (temperature = 0, model = 'gpt-4-turbo') => {
  return new OpenAI({
    temperature,
    model,
    openAIApiKey: openaiKey
  });
};
