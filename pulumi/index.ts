import * as aws from '@pulumi/aws';

const secretResource = new aws.secretsmanager.Secret('openai-api-key', {
  name: 'openai-api-key',
  description: 'Openai api key, september 2023'
});

// Output the ARN and name of the secret
export const secretArn = secretResource.arn;
export const secretName = secretResource.name;
