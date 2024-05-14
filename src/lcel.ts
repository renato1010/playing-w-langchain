import { ChatPromptTemplate, ParamsFromFString } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { openAIChatModel } from '@/utils/openai-chat.js';
import { RunnableSequence } from '@langchain/core/runnables';

const model = openAIChatModel;
const prompt = ChatPromptTemplate.fromTemplate(
  `What are three good names for a company that makes {product}?`
);
const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);
// const response = await chain.invoke({ product: 'colorful socks' });

// console.log({ response: JSON.stringify(response, undefined, 2) });

const runnableNameGenChain = RunnableSequence.from([prompt, model, outputParser]);
// const runnableResponse = await runnableNameGenChain.invoke({ product: 'colorful socks' });

// console.log({ runnableResponse });

// const streamResponse = await runnableNameGenChain.stream({ product: 'colorful socks' });

// implement await for loop
// for await (const chunk of streamResponse) {
//   console.log(chunk);
// }

// Batch

const inputs: ParamsFromFString<'What are three good names for a company that makes {product}?'>[] =
  [{ product: 'silk camp shirts' }, { product: 'linen mens pants' }];

const batchResponse = await runnableNameGenChain.batch(inputs);

console.log({ batchResponse });
