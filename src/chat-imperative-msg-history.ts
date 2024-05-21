import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { getOpenAIChatModel } from './utils/openai-chat.js';
import { ChatMessageHistory } from 'langchain/memory';

const model = getOpenAIChatModel({});

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant. Answer all questions to the best of your ability.'],
  new MessagesPlaceholder('messages')
]);

const chain = prompt.pipe(model);

const ephemeralChatMessageHistory = new ChatMessageHistory();

await ephemeralChatMessageHistory.addMessage(
  new HumanMessage('Translate this sentence from English to French: I love programming.')
);

await ephemeralChatMessageHistory.addMessage(new AIMessage("J'adore la programmation."));

await ephemeralChatMessageHistory.clear();

const input1 = 'Translate this sentence from English to French: I love programming.';

await ephemeralChatMessageHistory.addMessage(new HumanMessage(input1));

const response1 = await chain.invoke({
  messages: await ephemeralChatMessageHistory.getMessages()
});

await ephemeralChatMessageHistory.addMessage(response1);

const input2 = 'What did I just ask you?';

await ephemeralChatMessageHistory.addMessage(new HumanMessage(input2));

const response2 = await chain.invoke({
  messages: await ephemeralChatMessageHistory.getMessages()
});
await ephemeralChatMessageHistory.addMessage(new AIMessage(response2));
const msgs = await ephemeralChatMessageHistory.getMessages();

console.dir({ response1, response2, msgs });
