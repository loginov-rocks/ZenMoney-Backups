import { Fragment, useEffect, useState } from 'react';

import { Api } from './Api.mjs';
import {
  API_BASE_URL, USER_POOL_CLIENT_CALLBACK_URL, USER_POOL_CLIENT_ID, USER_POOL_DOMAIN, ZENMONEY_API_BASE_URL,
  ZENMONEY_API_CONSUMER_KEY, ZENMONEY_API_REDIRECT_URI,
} from './Constants';
import { UserPool } from './UserPool.mjs';
import { ZenMoney } from './ZenMoney.mjs';

const interceptAuthCode = (callback: (authCode: string) => void, zenMoneyCallback: (authCode: string) => void) => {
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

export const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (api.restoreAuthData()) {
      setIsAuthorized(true);
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
      setIsAuthorized(true);
    }, async (zenMoneyAuthCode) => {
      // loginButton.hidden = true;
      // zenMoneyLoginButton.hidden = true;

      try {
        await api.auth(zenMoneyAuthCode);
      } catch (error) {
        alert(error);

        // zenMoneyLoginButton.hidden = false;

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
  }, []);

  const handleLoginClick = () => {
    userPool.loginRedirect();
  };

  const handleZenMoneyLoginClick = () => {
    zenMoney.loginRedirect();
  };

  return (
    <Fragment>
      <h1>ZenMoney Backups</h1>
      {isAuthorized
        ? <button onClick={handleZenMoneyLoginClick}>ZenMoney Login</button>
        : <button onClick={handleLoginClick}>Login</button>}
    </Fragment>
  );
};
