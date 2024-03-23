import { FC, ReactNode, useEffect, useState } from 'react';

import apiService from '../services/Api';
import zenMoneyService from '../services/ZenMoney';
import { interceptAuthCode } from '../utils/interceptAuthCode';

interface Props {
  children: ReactNode;
}

export const ZenMoneyAuthGate: FC<Props> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authorize = async (): Promise<void> => {
    let getAuthResponse;
    try {
      getAuthResponse = await apiService.getAuth();
    } catch (error) {
      setIsLoading(false);

      alert(error);

      return;
    }

    if (getAuthResponse) {
      setIsAuthorized(true);
      setIsLoading(false);

      return;
    }

    const authCode = interceptAuthCode();

    if (authCode === null || authCode.type !== 'zenMoney') {
      setIsLoading(false);

      return;
    }

    try {
      await apiService.auth(authCode.authCode);
    } catch (error) {
      setIsLoading(false);

      alert(error);

      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  };

  useEffect(() => {
    authorize();
  }, []);

  const handleLoginClick = (): void => {
    zenMoneyService.loginRedirect();
  };

  if (isLoading) {
    return (
      <>
        <h2>ZenMoney Authorization</h2>
        <p>Loading...</p>
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <h2>ZenMoney Authorization</h2>
        <p><button onClick={handleLoginClick}>Login</button></p>
      </>
    );
  }

  return <>{children}</>;
};
