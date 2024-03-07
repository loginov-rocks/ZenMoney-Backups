import { SSMClient } from '@aws-sdk/client-ssm';

import {
  ZENMONEY_API_BASE_URL, ZENMONEY_API_CONSUMER_KEY_PARAMETER_NAME, ZENMONEY_API_CONSUMER_SECRET_PARAMETER_NAME,
  ZENMONEY_API_REDIRECT_URI,
} from './Constants.mjs';
import { SsmParameter } from './SsmParameter.mjs';
import { ZenMoneyApi } from './ZenMoneyApi.mjs';

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

  const { body } = event;
  const data = JSON.parse(body);
  const { zenMoneyAuthCode } = data;

  const zenMoneyApiConsumerKey = await zenMoneyApiConsumerKeyParameter.getValue();
  const zenMoneyApiConsumerSecret = await zenMoneyApiConsumerSecretParameter.getValue();

  zenMoneyApi.setConsumerKey(zenMoneyApiConsumerKey);
  zenMoneyApi.setConsumerSecret(zenMoneyApiConsumerSecret);

  const tokenResponse = await zenMoneyApi.token(zenMoneyAuthCode);

  return {
    body: JSON.stringify(tokenResponse),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 200,
  };
};
