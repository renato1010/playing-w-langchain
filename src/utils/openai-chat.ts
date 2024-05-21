import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { openaiKey } from '@/env-vars.js';
import { Callbacks } from '@langchain/core/callbacks/manager';
import { string } from 'valibot';

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

export const getOpenAIChatModel = ({
  temperature = 0,
  model = 'gpt-4-turbo',
  callbacks
}: {
  temperature?: number;
  model?: string;
  callbacks?: Callbacks | undefined;
}) => {
  return new ChatOpenAI({
    model,
    temperature,
    openAIApiKey: openaiKey,
    callbacks
  });
};

export const getOpenAILLM = ({
  temperature = 0,
  model = 'gpt-4-turbo',
  callbacks
}: {
  temperature?: number;
  model?: string;
  callbacks?: Callbacks | undefined;
}) => {
  return new OpenAI({
    temperature,
    model,
    openAIApiKey: openaiKey,
    callbacks
  });
};
