import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SSMClient } from '@aws-sdk/client-ssm';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import {
  BACKUPS_BUCKET_NAME, BACKUPS_CONTENT_TYPE, BACKUPS_KEY_SUFFIX, USERS_TABLE_NAME, ZENMONEY_API_BASE_URL,
  ZENMONEY_API_CONSUMER_KEY_PARAMETER_NAME, ZENMONEY_API_CONSUMER_SECRET_PARAMETER_NAME, ZENMONEY_API_REDIRECT_URI,
} from './Constants.mjs';
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

const serverTimestampToFileName = (serverTimestamp) => (
  new Date(serverTimestamp * 1000).toISOString().replace(/[T:.]/g, '-')
);

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { userId } = event;

  if (!userId) {
    console.error('User ID missing');

    return;
  }

  const getCommand = new GetCommand({
    Key: { userId },
    TableName: USERS_TABLE_NAME,
  });

  let getCommandOutput;
  try {
    getCommandOutput = await dynamoDbDocumentClient.send(getCommand);
  } catch (error) {
    console.error(error);

    return;
  }

  console.log('getCommandOutput', JSON.stringify(getCommandOutput));

  if (!getCommandOutput || !getCommandOutput.Item) {
    console.error(`Item with User ID ${userId} missing`);

    return;
  }

  const { token } = getCommandOutput.Item;

  if (!token.accessToken) {
    console.error(`Access Token for User ID ${userId} missing`);

    return;
  }

  let zenMoneyApiConsumerKey, zenMoneyApiConsumerSecret;
  try {
    zenMoneyApiConsumerKey = await zenMoneyApiConsumerKeyParameter.getValue();
    zenMoneyApiConsumerSecret = await zenMoneyApiConsumerSecretParameter.getValue();
  } catch (error) {
    console.error(error);

    return;
  }

  zenMoneyApi.setConsumerKey(zenMoneyApiConsumerKey);
  zenMoneyApi.setConsumerSecret(zenMoneyApiConsumerSecret);

  let diff;
  try {
    diff = await zenMoneyApi.diff(token.accessToken);
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

  let putObjectCommandOutput;
  try {
    putObjectCommandOutput = await s3Client.send(putObjectCommand);
  } catch (error) {
    console.error(error);

    return;
  }

  console.log('putObjectCommandOutput', JSON.stringify(putObjectCommandOutput));
};
