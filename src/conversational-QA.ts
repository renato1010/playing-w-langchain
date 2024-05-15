import {
  RunnablePassthrough,
  RunnableSequence,
  RunnableWithMessageHistory
} from '@langchain/core/runnables';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatMessageHistory } from 'langchain/memory';
import { getOpenAIChatModel } from '@/utils/index.js';
import { retriever } from './vectors-and-embeddings.js';

// Adding history
const convertDocsToString = (documents: Document[]): string => {
  return documents.map((document) => `<doc>\n${document.pageContent}\n</doc>`).join('\n');
};
const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question, 
rephrase the follow up question to be a standalone question.`;

const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
  ['system', REPHRASE_QUESTION_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('history'),
  ['human', 'Rephrase the following question as a standalone question:\n{question}']
]);

const rephraseQuestionChain = RunnableSequence.from([
  rephraseQuestionChainPrompt,
  getOpenAIChatModel(0.1),
  new StringOutputParser()
]);

const documentRetrievalChain = RunnableSequence.from([
  (input) => input.standalone_question,
  retriever,
  convertDocsToString
]);

const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history, 
answer the user's question to the best of 
your ability 
using only the resources provided. Be verbose!

<context>
{context}
</context>`;

const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
  ['system', ANSWER_CHAIN_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('history'),
  [
    'human',
    'Now, answer this question using the previous context and chat history:\n{standalone_question}'
  ]
]);

// const chatHistory = [new HumanMessage(originalQuestion), new AIMessage(originalAnswer)];

const conversationalRetrievalChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    standalone_question: rephraseQuestionChain
  }),
  RunnablePassthrough.assign({
    context: documentRetrievalChain
  }),
  answerGenerationChainPrompt,
  getOpenAIChatModel(0.1),
  new StringOutputParser()
]);

const messageHistory = new ChatMessageHistory();

const finalRetrievalChain = new RunnableWithMessageHistory({
  runnable: conversationalRetrievalChain,
  getMessageHistory: (_sessionId) => messageHistory,
  historyMessagesKey: 'history',
  inputMessagesKey: 'question'
});

const originalQuestion = 'What are the prerequisites for this course?';

const originalAnswer = await finalRetrievalChain.invoke(
  {
    question: originalQuestion
  },
  {
    configurable: { sessionId: 'test' }
  }
);
const finalResult = await finalRetrievalChain.invoke(
  {
    question: 'Can you list them in bullet point form?'
  },
  {
    configurable: { sessionId: 'test' }
  }
);
console.log({ finalResult });

/**
{
  finalResult: "Certainly, here's a bullet-point list of the prerequisites for the course as outlined in the provided context:\n" +
    '\n' +
    '- **Programming Skills**: \n' +
    '  - Some programming involved, primarily in MATLAB or Octave.\n' +
    '  - A short MATLAB tutorial will be available for those unfamiliar with it.\n' +
    '\n' +
    '- **Basic Knowledge of Computer Science**:\n' +
    '  - Understanding of big O notation.\n' +
    '  - Knowledge of data structures like linked lists, queues, or binary trees.\n' +
    '  - Specific programming languages like C or Java are not emphasized.\n' +
    '\n' +
    '- **Familiarity with Basic Probability and Statistics**:\n' +
    '  - Understanding of random variables, expectation, and variance.\n' +
    '  - Equivalent knowledge to an undergraduate statistics class (e.g., Stat 116 at Stanford).\n' +
    '\n' +
    '- **Basic Linear Algebra**:\n' +
    '  - Knowledge of matrices and vectors, matrix multiplication, and matrix inverses.\n' +
    '  - Familiarity with eigenvectors is beneficial but not strictly necessary.\n' +
    '  - Courses like Math 51, 103, Math 113, or CS205 at Stanford would provide sufficient background.\n' +
    '\n' +
    'Additionally, discussion sections will offer refreshers on some of these prerequisites for those who might need it.'
}
*/
