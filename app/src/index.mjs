import express from 'express';

import {
  PORT, ZENMONEY_API_BASE_URL, ZENMONEY_API_CONSUMER_KEY, ZENMONEY_API_CONSUMER_SECRET, ZENMONEY_API_REDIRECT_URI,
} from './Constants.mjs';
import { ZenMoneyApi } from './ZenMoneyApi.mjs';

const app = express();

const zenMoneyApi = new ZenMoneyApi({
  baseUrl: ZENMONEY_API_BASE_URL,
  consumerKey: ZENMONEY_API_CONSUMER_KEY,
  consumerSecret: ZENMONEY_API_CONSUMER_SECRET,
  redirectUri: ZENMONEY_API_REDIRECT_URI,
});

app.use(express.json());

app.post('/auth/token', async (request, response) => {
  const { code } = request.body;

  let tokenResponse;
  try {
    tokenResponse = await zenMoneyApi.token(code);
  } catch (error) {
    console.error(error);

    return response.status(error.status).json({ error });
  }

  return response.json(tokenResponse);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
