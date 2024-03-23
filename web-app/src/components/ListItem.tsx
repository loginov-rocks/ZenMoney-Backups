import { FC, useState } from 'react';

import apiService from '../services/Api';

interface Backup {
  fileName: string;
  serverTimestamp: number;
  size: number;
}

interface Props {
  backup: Backup;
}

export const ListItem: FC<Props> = ({ backup }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    let url;
    try {
      url = await apiService.download(backup.fileName);
    } catch (error) {
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
