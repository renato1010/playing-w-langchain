import * as aws from '@pulumi/aws';

const openaiApiKey = new aws.secretsmanager.Secret('OPENAI_API_KEY', {
  name: 'openai-api-key',
  description: 'Openai api key, september 2023'
});

const pineconeApiKey = new aws.secretsmanager.Secret('PINECONE_API_KEY', {
  name: 'pinecone-api-key',
  description: 'Pinecone api key for cool-index'
});

// Output the ARN and name of the secret
export const secretArn = openaiApiKey.arn;
export const secretName = openaiApiKey.name;
export const pineconeSecretArn = pineconeApiKey.arn;
export const pineconeSecretName = pineconeApiKey.name;
