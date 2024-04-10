import { FC, ReactNode, useEffect, useState } from 'react';

import apiService from '../services/Api';
import zenMoneyService from '../services/ZenMoney';
import { interceptAuthCode } from '../utils/interceptAuthCode';

interface Props {
  children: ReactNode;
}

// TODO: Refactor.
export const ZenMoneyAuthGate: FC<Props> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authorize = async (): Promise<void> => {
    // 1. Validate ZenMoney auth.
    let isZenMoneyAuthValid;
    try {
      isZenMoneyAuthValid = await apiService.zenMoneyValidateAuth();
    } catch (error) {
      console.error('ZenMoneyAuthGate error when attempting to validate ZenMoney authorization', error);
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
      console.error('ZenMoneyAuthGate error when attempting to authorize ZenMoney', error);
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

  if (isLoading || !isAuthorized) {
    return (
      <>
        <h2>ZenMoney Authorization</h2>
        {isLoading
          ? <p>Loading...</p>
          : <p><button onClick={handleLoginClick}>Login</button></p>}
      </>
    );
  }

  return <>{children}</>;
};
