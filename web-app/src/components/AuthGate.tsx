import { FC, ReactNode, useEffect, useState } from 'react';

import apiService from '../services/Api';
import userPoolService from '../services/UserPool';
import { interceptAuthCode } from '../utils/interceptAuthCode';

interface Props {
  children: ReactNode;
}

export const AuthGate: FC<Props> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authorize = async (authCode: string): Promise<void> => {
    let authData;
    try {
      authData = await userPoolService.auth(authCode);
    } catch (error) {
      alert(error);

      return;
    }

    apiService.storeAuthData(authData);
    setIsAuthorized(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (apiService.restoreAuthData()) {
      setIsAuthorized(true);
    }

    const authCode = interceptAuthCode();

    if (authCode !== null && authCode.type === 'userPool') {
      authorize(authCode.authCode);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLoginClick = (): void => {
    userPoolService.loginRedirect();
  };

  if (isLoading) {
    return (
      <>
        <h2>Authorization</h2>
        <p>Loading...</p>
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <h2>Authorization</h2>
        <p><button onClick={handleLoginClick}>Login</button></p>
      </>
    );
  }

  return <>{children}</>;
};
