import { FC, useState } from 'react';

import apiService from '../services/Api';
import { Backup } from '../services/Api/Api';

interface Props {
  backup: Backup;
}

export const BackupsListItem: FC<Props> = ({ backup }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    let url;
    try {
      url = await apiService.backupsCreateUrl(backup.fileName);
    } catch (error) {
      console.error('BackupsListItem error when attempting to get backup url', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setIsLoading(false);

    window.open(url);
  };

  return (
    <>
      <a href="#" onClick={handleClick}>{new Date(backup.serverTimestamp * 1000).toString()}</a>
      {' '}
      ({Math.round(backup.size / 1024)} KB)
      {isLoading && ' Loading...'}
    </>
  );
};
