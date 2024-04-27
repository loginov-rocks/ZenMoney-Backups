import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import { USERS_TABLE_NAME } from './Constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { executionId, userId } = event;

  if (!executionId || !userId) {
    return { statusCode: 400 };
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

    return { statusCode: 500 };
  }

  // Hide to avoid logging ZenMoney tokens.
  // console.log('getCommandOutput', JSON.stringify(getCommandOutput));

  const isAuthorized = Boolean(getCommandOutput && getCommandOutput.Item);

  return { isAuthorized, userId };
};
