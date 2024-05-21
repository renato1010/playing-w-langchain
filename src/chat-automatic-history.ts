import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Serialized } from '@langchain/core/load/serializable';
import { LLMResult } from '@langchain/core/outputs';
import { ChatMessageHistory } from 'langchain/memory';
import { getOpenAIChatModel } from './utils/index.js';
import { RunnableConfig, RunnableWithMessageHistory } from '@langchain/core/runnables';

const model = getOpenAIChatModel({
  callbacks: [
    {
      handleLLMStart: async (_llm: Serialized, prompts: string[]) => {
        console.log('LLMStart: ', JSON.stringify(prompts, null, 2));
      },
      handleLLMEnd: async (output: LLMResult) => {
        console.log('LLMEnd: ', JSON.stringify(output, null, 2));
      }
    }
  ]
});

const runnableWithMessageHistoryPrompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant. Answer all questions to the best of your ability.'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}']
]);
const chain = runnableWithMessageHistoryPrompt.pipe(model);

const ephemeralChatMessageHistory = new ChatMessageHistory();
const chainWithMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId: string) => ephemeralChatMessageHistory,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history'
});
const config: RunnableConfig = { configurable: { sessionId: 'unused' } };
const aiRes1 = await chainWithMessageHistory.invoke(
  {
    input: 'Translate this sentence from English to French: I love programming.'
  },
  config
);
const aiRes2 = await chainWithMessageHistory.invoke(
  {
    input: 'What did I just ask you?'
  },
  config
);
const chatHistory = (await ephemeralChatMessageHistory.getMessages()).map((m) => m.content);
console.log({
  aiRes1: aiRes1.content,
  aiRes2: aiRes2.content,
  chatHistory: JSON.stringify(chatHistory, null, 2)
});
