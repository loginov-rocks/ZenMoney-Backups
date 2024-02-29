import { ZenMoney } from './ZenMoney.mjs';

window.addEventListener('load', () => {
  const zenMoney = new ZenMoney({
    baseUrl: ZENMONEY_API_BASE_URL,
    consumerKey: ZENMONEY_API_CONSUMER_KEY,
    redirectUri: ZENMONEY_API_REDIRECT_URI,
  });

  document.getElementById('login').addEventListener('click', () => {
    zenMoney.loginRedirect();
  });
});
