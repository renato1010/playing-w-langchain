import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getOpenAILLM } from './utils/openai-chat.js';

const llm = getOpenAILLM();

// notice that "chatHistory" variable is present in the prompt template
const template = `You are a nice chatbot having a conversation with a human.

Previous conversation:
{chatHistory}

New human question: {question}
Response:`;

const prompt = PromptTemplate.fromTemplate(template);

// notice that we need to align the 'memoryKey' with the variable in the prompt
const llmMemory = new BufferMemory({ memoryKey: 'chatHistory' });
const conversationChain = new LLMChain({
  llm,
  prompt,
  memory: llmMemory,
  outputParser: new StringOutputParser()
});

// notice that we just pass in the 'question' variable
// 'chatHistory' variable will be automatically filled in by the BufferMemory
const original = await conversationChain.invoke({ question: 'Wht is your name?' });
const followup = await conversationChain.invoke({ question: 'What did I just ask you?' });

console.log({ original, followup });
