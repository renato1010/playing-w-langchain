// import ignore from 'ignore';
// import * as parse from 'pdf-parse';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getESMFilePath } from '@/utils/index.js';

// will not include anything under "ignorePaths"
const githubLoader = new GithubRepoLoader('https://github.com/langchain-ai/langchainjs', {
  recursive: false,
  ignorePaths: ['*.md', 'yarn.lock']
});

// const docs = await githubLoader.load();
// console.log(docs.slice(0, 2));
const pdfFilePath = await getESMFilePath('../../data/MachineLearning-Lecture01.pdf');
const pdfLoader = new PDFLoader(pdfFilePath);

const rawCS229Docs = await pdfLoader.load();
// splitting
const pdfSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 64
});

const splittedDocs = await pdfSplitter.splitDocuments(rawCS229Docs);
console.log(
  'PageContent1-2: ',
  JSON.stringify(splittedDocs[0].pageContent, undefined, 2),
  JSON.stringify(splittedDocs[1].pageContent, undefined, 2)
);
