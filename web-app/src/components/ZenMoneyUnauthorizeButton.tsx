import { useState } from 'react';

import apiService from '../services/Api';

export const ZenMoneyUnauthorizeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await apiService.zenMoneyUnauthorize();
    } catch (error) {
      console.error('ZenMoneyUnauthorizeButton error when attempting to unauthorize', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setIsUnauthorized(true);
    setIsLoading(false);
  }

  return isUnauthorized
    ? <>ZenMoney authorization was removed, no backups will be done until reauthorization.</>
    : <button disabled={isLoading} onClick={handleClick}>Unauthorize ZenMoney Access</button>;
};
