import { RunnableSequence } from 'langchain/runnables';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableMap } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { retriever } from './vectors-and-embeddings.js';
import { openAIChatModel } from '@/utils/index.js';

export const convertDocsToString = (documents: Document[]): string => {
  return documents.map((doc) => `<doc>\n ${doc.pageContent}\n</doc>`).join('\n');
};

export const pdfDocRetrievalChain = RunnableSequence.from([
  (input) => input.question,
  retriever,
  convertDocsToString
]);

const contextDocs = await pdfDocRetrievalChain.invoke({
  question: 'What are the prerequisites for this course?'
});

// synthesizing a response
export const TEMPLATE_STRING = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question 
to the best of your ability using only the resources provided. 
Be verbose!

<context>

{context}

</context>

Now, answer this question using the above context:

{question}`;
const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(TEMPLATE_STRING);
const runnableMap = RunnableMap.from({
  context: pdfDocRetrievalChain,
  question: (input: { question: string }) => input.question
});

// const runnableMapFullText = await runnableMap.invoke({
//   question: 'What are the prerequisites for this course'
// });

// Augmented generation
export const retrievalChain = RunnableSequence.from([
  { context: pdfDocRetrievalChain, question: (input: { question: string }) => input.question },
  answerGenerationPrompt,
  openAIChatModel,
  new StringOutputParser()
]);

const answerForUser = await retrievalChain.invoke({
  question: 'What are the prerequisites for this course?'
});

// for await (const chunk of answerForUser) {
//   console.log(chunk);
// }

console.log({ answerForUser });

// const followupAnswer = await retrievalChain.invoke({
//   question: 'Can you list them in bullet point form?'
// });
// console.log({ followupAnswer });
