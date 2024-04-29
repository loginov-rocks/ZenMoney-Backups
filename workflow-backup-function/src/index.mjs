import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SSMClient } from '@aws-sdk/client-ssm';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import {
  BACKUPS_BUCKET_NAME, BACKUPS_CONTENT_TYPE, BACKUPS_KEY_SUFFIX, ZENMONEY_API_BASE_URL,
  ZENMONEY_API_CONSUMER_KEY_PARAMETER_NAME, ZENMONEY_API_CONSUMER_SECRET_PARAMETER_NAME, ZENMONEY_API_REDIRECT_URI,
  ZENMONEY_TOKENS_TABLE_NAME,
} from './Constants.mjs';
import { serverTimestampToFileName } from './serverTimestampToFileName.mjs';
import { SsmParameter } from './SsmParameter.mjs';
import { ZenMoneyApi } from './ZenMoneyApi.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
const s3Client = new S3Client();
const ssmClient = new SSMClient();

const zenMoneyApiConsumerKeyParameter = new SsmParameter({
  parameterName: ZENMONEY_API_CONSUMER_KEY_PARAMETER_NAME,
  ssmClient,
});

const zenMoneyApiConsumerSecretParameter = new SsmParameter({
  parameterName: ZENMONEY_API_CONSUMER_SECRET_PARAMETER_NAME,
  ssmClient,
});

const zenMoneyApi = new ZenMoneyApi({
  baseUrl: ZENMONEY_API_BASE_URL,
  redirectUri: ZENMONEY_API_REDIRECT_URI,
});

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { userId } = event;

  if (!userId) {
    throw new Error('User ID missing');
  }

  const getCommand = new GetCommand({
    Key: { userId },
    TableName: ZENMONEY_TOKENS_TABLE_NAME,
  });

  const getCommandOutput = await dynamoDbDocumentClient.send(getCommand);

  // Hide to avoid logging ZenMoney tokens.
  // console.log('getCommandOutput', JSON.stringify(getCommandOutput));

  if (!getCommandOutput || !getCommandOutput.Item) {
    throw new Error(`DynamoDB record for user ID ${userId} missing`);
  }

  const { zenMoneyTokens } = getCommandOutput.Item;

  if (!zenMoneyTokens.accessToken) {
    throw new Error(`Access token for user ID ${userId} missing`);
  }

  const zenMoneyApiConsumerKey = await zenMoneyApiConsumerKeyParameter.getValue();
  const zenMoneyApiConsumerSecret = await zenMoneyApiConsumerSecretParameter.getValue();

  zenMoneyApi.setConsumerKey(zenMoneyApiConsumerKey);
  zenMoneyApi.setConsumerSecret(zenMoneyApiConsumerSecret);

  let diff;
  try {
    diff = await zenMoneyApi.diff(zenMoneyTokens.accessToken);
  } catch (error) {
    // TODO: Try to refresh token and update in the DynamoDB table if successful.
    console.error(error);

    return;
  }

  const { serverTimestamp } = diff;
  const objectKey = `${userId}/${serverTimestampToFileName(serverTimestamp)}${BACKUPS_KEY_SUFFIX}`;

  const putObjectCommand = new PutObjectCommand({
    Body: JSON.stringify(diff),
    Bucket: BACKUPS_BUCKET_NAME,
    ContentType: BACKUPS_CONTENT_TYPE,
    Key: objectKey,
  });

  const putObjectCommandOutput = await s3Client.send(putObjectCommand);

  console.log('putObjectCommandOutput', JSON.stringify(putObjectCommandOutput));

  return { userId };
};
