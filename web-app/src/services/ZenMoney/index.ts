import { ZenMoney } from './ZenMoney.mjs';

import { ZENMONEY_API_BASE_URL, ZENMONEY_API_CONSUMER_KEY, ZENMONEY_API_REDIRECT_URI } from '../../Constants';

const zenMoney = new ZenMoney({
  baseUrl: ZENMONEY_API_BASE_URL,
  consumerKey: ZENMONEY_API_CONSUMER_KEY,
  redirectUri: ZENMONEY_API_REDIRECT_URI,
});

export default zenMoney;
