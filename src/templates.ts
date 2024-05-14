import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from '@langchain/core/prompts';

const prompt = ChatPromptTemplate.fromTemplate(
  `What are three good names for a company that makes {product}?`
);

const formattedPrompt = await prompt.format({ product: 'colorful socks' });

// console.log({ formattedPrompt });

const formattedMessages = await prompt.formatMessages({ product: 'colorful socks' });

// console.log({ formattedMessages: JSON.stringify(formattedMessages, undefined, 2) });

// const promptFromMessages = ChatPromptTemplate.fromMessages([
//   SystemMessagePromptTemplate.fromTemplate('Your are an expert at picking company names.'),
//   HumanMessagePromptTemplate.fromTemplate('What are three good names for a company that makes {product}?')
// ]);
const promptFromMessages = ChatPromptTemplate.fromMessages([
  ['system', 'Your are an expert at picking company names.'],
  ['human', 'What are three good names for a company that makes {product}?']
]);

const formattedPromptFromMessages = await promptFromMessages.formatMessages({
  product: 'shiny objects'
});
console.log({ formattedPromptFromMessages });
