import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { BACKUP_QUEUE_URL, BACKUPS_BUCKET_NAME, USERS_TABLE_NAME } from './Constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
const s3Client = new S3Client();
const sqsClient = new SQSClient();

export const handler = async (event) => {
  console.log('event', JSON.stringify(event));

  const scanCommand = new ScanCommand({
    TableName: USERS_TABLE_NAME,
  });

  let scanCommandOutput;
  try {
    scanCommandOutput = await dynamoDbDocumentClient.send(scanCommand);
  } catch (error) {
    console.error(error);

    return;
  }

  // Hide to avoid logging ZenMoney tokens.
  // console.log('scanCommandOutput', JSON.stringify(scanCommandOutput));

  if (!scanCommandOutput.Count || scanCommandOutput.Count === 0 || !scanCommandOutput.Items
    || !Array.isArray(scanCommandOutput.Items)) {
    return;
  }

  // TODO

  const message = JSON.stringify({ userId: scanCommandOutput.Items[0].userId });

  console.log('message', message);

  const sendMessageCommand = new SendMessageCommand({
    MessageBody: message,
    QueueUrl: BACKUP_QUEUE_URL,
  });

  let sendMessageCommandOutput;
  try {
    sendMessageCommandOutput = await sqsClient.send(sendMessageCommand);
  } catch (error) {
    console.error(error);

    return;
  }

  console.log('sendMessageCommandOutput', JSON.stringify(sendMessageCommandOutput));
};
