import * as v from 'valibot';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  type GetSecretValueCommandInput
} from '@aws-sdk/client-secrets-manager';

const REGION = 'us-east-2';
const client = new SecretsManagerClient({ region: REGION });

const getSecretKeyByName = async (secretName: string): Promise<string | undefined> => {
  const input: GetSecretValueCommandInput = {
    SecretId: secretName
  };
  const command = new GetSecretValueCommand(input);
  try {
    const response = await client.send(command);
    return response.SecretString;
  } catch (error) {
    throw new Error(`Error retrieving secret key ${secretName}`);
  }
};

const openAISecretName = `arn:aws:secretsmanager:us-east-2:${await getSecretKeyByName(
  'renato-acc-id'
)}:secret:openai-api-key-CS0Iiu`;
const pineconeSecretName = `arn:aws:secretsmanager:us-east-2:${await getSecretKeyByName(
  'renato-acc-id'
)}:secret:pinecone-api-key-gzD26P`;

const envVarsSchema = v.object({
  openaiKey: v.string('openai api key is required', [v.minLength(1, 'Enter OpenAI key')]),
  pineconeKey: v.string('pinecone api key is required', [v.minLength(1, 'Enter Pinecone key')])
});

const result = v.safeParse(envVarsSchema, {
  openaiKey: await getSecretKeyByName(openAISecretName),
  pineconeKey: await getSecretKeyByName(pineconeSecretName)
});

if (!result.success) {
  const issues = result.issues?.reduce<string>(
    (_prev, cur) => `expected: ${cur.expected}, received: ${cur.received}`,
    ''
  );
  throw new Error(issues);
}
let { openaiKey, pineconeKey } = result.output;

export { openaiKey, pineconeKey };
