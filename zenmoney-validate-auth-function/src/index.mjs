import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import { ZENMONEY_TOKENS_TABLE_NAME } from './Constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { requestContext } = event;

  if (!requestContext || !requestContext.authorizer || !requestContext.authorizer.jwt
    || !requestContext.authorizer.jwt.claims || !requestContext.authorizer.jwt.claims.sub) {
    return { statusCode: 401 };
  }

  const userId = requestContext.authorizer.jwt.claims.sub;

  const getCommand = new GetCommand({
    Key: { userId },
    TableName: ZENMONEY_TOKENS_TABLE_NAME,
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

  if (!getCommandOutput || !getCommandOutput.Item) {
    return { statusCode: 404 };
  }

  const { authorized } = getCommandOutput.Item;

  return {
    body: JSON.stringify({ authorized }),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 200,
  };
};
