import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import { EXECUTIONS_TABLE_NAME, ZENMONEY_TOKENS_TABLE_NAME } from './Constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const { current: { executionArn: currentExecutionArn }, previousExecutionArn, userId } = event;

  if (!currentExecutionArn || !userId) {
    throw new Error('Current execution ARN or user ID missing');
  }

  const zenMoneyTokensGetCommand = new GetCommand({
    Key: { userId },
    TableName: ZENMONEY_TOKENS_TABLE_NAME,
  });

  const zenMoneyTokensGetCommandOutput = await dynamoDbDocumentClient.send(zenMoneyTokensGetCommand);

  // Hide to avoid logging ZenMoney tokens.
  // console.log('zenMoneyTokensGetCommandOutput', JSON.stringify(zenMoneyTokensGetCommandOutput));

  const isAuthorized = Boolean(zenMoneyTokensGetCommandOutput && zenMoneyTokensGetCommandOutput.Item);

  // No user in DynamoDB, return unauthorized.
  if (!isAuthorized) {
    return { isAuthorized, userId };
  }

  const executionsGetCommand = new GetCommand({
    Key: { userId },
    TableName: EXECUTIONS_TABLE_NAME,
  });

  const executionsGetCommandOutput = await dynamoDbDocumentClient.send(executionsGetCommand);

  console.log('executionsGetCommandOutput', JSON.stringify(executionsGetCommandOutput));

  // There is execution running for this user ID.
  if (executionsGetCommandOutput && executionsGetCommandOutput.Item) {
    const { executionArn } = executionsGetCommandOutput.Item;

    // This is a new execution from ZenMoney Auth Function (no previous execution ARN) or a mismatch with the previous
    // execution ARN.
    if (!previousExecutionArn || previousExecutionArn !== executionArn) {
      return { isAuthorized, isConcurrent: true, userId };
    }
  }

  // If no execution is running for this user ID, or the previous execution ARN provided and matches the one in
  // DynamoDB.
  const item = {
    executionArn: currentExecutionArn,
    updated: Date.now(),
    userId,
  };

  const executionsPutCommand = new PutCommand({
    Item: item,
    TableName: EXECUTIONS_TABLE_NAME,
  });

  const executionsPutCommandOutput = await dynamoDbDocumentClient.send(executionsPutCommand);

  console.log('executionsPutCommandOutput', JSON.stringify(executionsPutCommandOutput));

  return { isAuthorized, isConcurrent: false, userId };
};
