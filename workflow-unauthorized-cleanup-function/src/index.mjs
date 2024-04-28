import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { EXECUTIONS_TABLE_NAME } from './Constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { userId } = event;

  if (!userId) {
    throw new Error('User ID missing');
  }

  const deleteCommand = new DeleteCommand({
    Key: { userId },
    TableName: EXECUTIONS_TABLE_NAME,
  });

  const deleteCommandOutput = await dynamoDbDocumentClient.send(deleteCommand);

  console.log('deleteCommandOutput', JSON.stringify(deleteCommandOutput));

  return { userId };
};
