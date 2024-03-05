import express from 'express';

import {
  PORT, ZENMONEY_API_BASE_URL, ZENMONEY_API_CONSUMER_KEY, ZENMONEY_API_CONSUMER_SECRET, ZENMONEY_API_REDIRECT_URI,
} from './Constants.mjs';
import { DataService } from './DataService.mjs';
import { DiffCachingService } from './DiffCachingService.mjs';
import { ZenMoneyApi } from './ZenMoneyApi/ZenMoneyApi.mjs';

const zenMoneyApi = new ZenMoneyApi({
  baseUrl: ZENMONEY_API_BASE_URL,
  consumerKey: ZENMONEY_API_CONSUMER_KEY,
  consumerSecret: ZENMONEY_API_CONSUMER_SECRET,
  redirectUri: ZENMONEY_API_REDIRECT_URI,
});

const diffCachingService = new DiffCachingService({
  zenMoneyApi,
});

const dataService = new DataService({
  diffCachingService,
});

const app = express();

app.use(express.json());

app.get('/accounts', async (request, response) => {
  const accessToken = request.headers.authorization.substring(7);

  let accounts;
  try {
    accounts = await dataService.accounts(accessToken);
  } catch (error) {
    console.error(error);

    return response.status(error.status).json({ error });
  }

  return response.json({ accounts });
});

app.get('/transactions', async (request, response) => {
  const accessToken = request.headers.authorization.substring(7);

  let transactions;
  try {
    transactions = await dataService.transactions(accessToken);
  } catch (error) {
    console.error(error);

    return response.status(error.status).json({ error });
  }

  return response.json({ transactions });
});

app.get('/user', async (request, response) => {
  const accessToken = request.headers.authorization.substring(7);

  let user;
  try {
    user = await dataService.user(accessToken);
  } catch (error) {
    console.error(error);

    return response.status(error.status).json({ error });
  }

  return response.json({ user });
});

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
