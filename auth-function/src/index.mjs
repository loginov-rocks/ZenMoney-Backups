import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SSMClient } from '@aws-sdk/client-ssm';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import {
  USERS_TABLE_NAME, ZENMONEY_API_BASE_URL, ZENMONEY_API_CONSUMER_KEY_PARAMETER_NAME,
  ZENMONEY_API_CONSUMER_SECRET_PARAMETER_NAME, ZENMONEY_API_REDIRECT_URI,
} from './Constants.mjs';
import { SsmParameter } from './SsmParameter.mjs';
import { ZenMoneyApi } from './ZenMoneyApi.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);
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

  const { body, requestContext } = event;

  if (!requestContext || !requestContext.authorizer || !requestContext.authorizer.jwt
    || !requestContext.authorizer.jwt.claims || !requestContext.authorizer.jwt.claims.sub) {
    return { statusCode: 401 };
  }

  const userId = requestContext.authorizer.jwt.claims.sub;

  let data;
  try {
    data = JSON.parse(body);
  } catch (error) {
    console.error(error);

    return { statusCode: 400 };
  }

  const { zenMoneyAuthCode } = data;

  if (!zenMoneyAuthCode) {
    return { statusCode: 400 };
  }

  let zenMoneyApiConsumerKey, zenMoneyApiConsumerSecret;
  try {
    zenMoneyApiConsumerKey = await zenMoneyApiConsumerKeyParameter.getValue();
    zenMoneyApiConsumerSecret = await zenMoneyApiConsumerSecretParameter.getValue();
  } catch (error) {
    console.error(error);

    return { statusCode: 500 };
  }

  zenMoneyApi.setConsumerKey(zenMoneyApiConsumerKey);
  zenMoneyApi.setConsumerSecret(zenMoneyApiConsumerSecret);

  let token;
  try {
    token = await zenMoneyApi.token(zenMoneyAuthCode);
  } catch (error) {
    console.error(error);

    return { statusCode: 502 };
  }

  const item = { authorizedAt: Date.now(), userId, token };

  const putCommand = new PutCommand({
    Item: item,
    TableName: USERS_TABLE_NAME,
  });

  let putCommandOutput;
  try {
    putCommandOutput = await dynamoDbDocumentClient.send(putCommand);
  } catch (error) {
    console.error(error);

    return { statusCode: 500 };
  }

  console.log('putCommandOutput', JSON.stringify(putCommandOutput));

  return { statusCode: 204 };
};
