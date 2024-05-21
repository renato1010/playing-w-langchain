import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { getOpenAIChatModel, getOpenAILLM } from '@/utils/index.js';
import { Runnable, RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { pull } from 'langchain/hub';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { splittedDocs } from './loading-preparing-data.js';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { retriever } from './vectors-and-embeddings.js';
import { formatDocumentsAsString } from 'langchain/util/document';
import { AIMessage, BaseChatMessageHistory, BaseMessage } from 'langchain/schema';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';

const chatModel = getOpenAIChatModel({ temperature: 0.4 });
const model = getOpenAILLM({});

async function run() {
  // const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');
  const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ['system', contextualizeQSystemPrompt],
    new MessagesPlaceholder('chat_history'),
    ['human', '{question}']
  ]);
  const contextualizeQChain = contextualizeQPrompt.pipe(chatModel).pipe(new StringOutputParser());

  const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use seven sentences as the maximum output, always try to keep the answer concise.

{context}`;

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ['system', qaSystemPrompt],
    new MessagesPlaceholder('chat_history'),
    ['human', '{question}']
  ]);

  const contextualizedQuestion = (input: Record<string, unknown>): Runnable => {
    if ('chat_history' in input) {
      return contextualizeQChain;
    }
    return input.question as Runnable;
  };

  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input: Record<string, unknown>) => {
        if ('chat_history' in input) {
          const chain = contextualizedQuestion(input);
          return chain.pipe(retriever).pipe(formatDocumentsAsString);
        }
        return '';
      }
    }),
    qaPrompt,
    chatModel
  ]);
  let chat_history: BaseMessage[] = [];
  const aiMsg1 = await ragChain.invoke({
    question: 'What are the prerequisites for this course?',
    chat_history
  });
  chat_history.push(aiMsg1);
  const aiMsg2 = await ragChain.invoke({
    question: 'please list prerequisites in bullet format',
    chat_history
  });
  chat_history.push(aiMsg2);
  console.log({ aiMsg1, aiMsg2, chat_history });
}

await run();
