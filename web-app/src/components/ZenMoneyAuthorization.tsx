import { FC, useEffect, useState } from 'react';

import { ZENMONEY_AUTHORIZATION_BACKUPS_RETENTION_PERIOD } from '../Constants';
import apiService from '../services/Api';
import zenMoneyService from '../services/ZenMoney';
import { interceptAuthCode } from '../utils/interceptAuthCode';

export const ZenMoneyAuthorization: FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authorize = async (): Promise<void> => {
    // 1. Validate ZenMoney auth.
    let isZenMoneyAuthValid;
    try {
      isZenMoneyAuthValid = await apiService.zenMoneyValidateAuth();
    } catch (error) {
      console.error('ZenMoneyAuthorization error when attempting to validate ZenMoney authorization', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    // 2. Set state to authorized in case ZenMoney auth is valid on the back end and exit.
    if (isZenMoneyAuthValid) {
      setIsAuthorized(true);
      setIsLoading(false);

      return;
    }

    // 3. Otherwise, try to intercept the ZenMoney auth code.
    const authCode = interceptAuthCode();

    // 4. Exit if no auth code is intercepted or the auth code is not of ZenMoney type.
    if (authCode === null || authCode.type !== 'zenMoney') {
      setIsLoading(false);

      return;
    }

    // 5. Otherwise, send the ZenMoney auth code to the back end.
    try {
      await apiService.zenMoneyAuth(authCode.authCode);
    } catch (error) {
      console.error('ZenMoneyAuthorization error when attempting to authorize ZenMoney', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    // 6. Set state to authorized in case of success.
    setIsAuthorized(true);
    setIsLoading(false);
  };

  useEffect(() => {
    authorize();
  }, []);

  const handleLoginClick = (): void => {
    zenMoneyService.loginRedirect();
  };

  const handleUnauthorizeClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await apiService.zenMoneyUnauthorize();
    } catch (error) {
      console.error('ZenMoneyAuthorization error when attempting to unauthorize ZenMoney', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setIsAuthorized(false);
    setIsLoading(false);
  }

  return (
    <>
      <h2>ZenMoney Authorization</h2>
      {isLoading
        ? <p>Loading...</p>
        : (isAuthorized
          ? (
            <>
              <p>The system is authorized to obtain your data from ZenMoney. Backups will be done <strong>daily</strong> and stored for up to <strong>{ZENMONEY_AUTHORIZATION_BACKUPS_RETENTION_PERIOD} days</strong>.</p>
              <p>Revoke authorization to stop backups and prevent the system from accessing your data from ZenMoney.</p>
              <p><button onClick={handleUnauthorizeClick}>Unauthorize</button></p>
            </>
          ) : (
            <>
              <p>The system is <strong>not</strong> authorized to obtain your data from ZenMoney.</p>
              <p>Authorize to allow the system to obtain your data from ZenMoney and start backups.</p>
              <p><button onClick={handleLoginClick}>Login</button></p>
            </>
          )
        )}
    </>
  );
};
