import { Api } from './Api.mjs';
import { UserPool } from './UserPool.mjs';
import { ZenMoney } from './ZenMoney.mjs';

const interceptAuthCode = (callback, zenMoneyCallback) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const authCode = urlSearchParams.get('code');
  const zenMoneyUserId = urlSearchParams.get('user_id');

  if (authCode) {
    if (zenMoneyUserId) {
      zenMoneyCallback(authCode);
    } else {
      callback(authCode);
    }
  }
};

window.addEventListener('load', () => {
  const api = new Api({
    baseUrl: API_BASE_URL,
  });

  const userPool = new UserPool({
    clientCallbackUrl: USER_POOL_CLIENT_CALLBACK_URL,
    clientId: USER_POOL_CLIENT_ID,
    domain: USER_POOL_DOMAIN,
  });

  const zenMoney = new ZenMoney({
    baseUrl: ZENMONEY_API_BASE_URL,
    consumerKey: ZENMONEY_API_CONSUMER_KEY,
    redirectUri: ZENMONEY_API_REDIRECT_URI,
  });

  const loginButton = document.getElementById('login');
  const zenMoneyLoginButton = document.getElementById('zenMoneyLogin');

  loginButton.addEventListener('click', () => {
    userPool.loginRedirect();
  });

  zenMoneyLoginButton.addEventListener('click', () => {
    zenMoney.loginRedirect();
  });

  if (api.restoreAuthData()) {
    loginButton.hidden = true;
    zenMoneyLoginButton.hidden = false;
  } else {
    loginButton.hidden = false;
    zenMoneyLoginButton.hidden = true;
  }

  interceptAuthCode(async (authCode) => {
    let authData;
    try {
      authData = await userPool.auth(authCode);
    } catch (error) {
      alert(error);

      return;
    }

    api.storeAuthData(authData);

    loginButton.hidden = true;
    zenMoneyLoginButton.hidden = false;
  }, async (zenMoneyAuthCode) => {
    loginButton.hidden = true;
    zenMoneyLoginButton.hidden = true;

    try {
      await api.auth(zenMoneyAuthCode);
    } catch (error) {
      alert(error);

      zenMoneyLoginButton.hidden = false;

      return;
    }

    let listResponse;
    try {
      listResponse = await api.list();
    } catch (error) {
      alert(error);

      return;
    }

    console.log(listResponse);
  });
});
