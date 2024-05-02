import { FC, useState } from 'react';

import apiService from '../services/Api';
import { Backup } from '../services/Api/Api';

interface Props {
  backup: Backup;
}

export const BackupsListItem: FC<Props> = ({ backup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleCreateUrlClick = async (): Promise<void> => {
    setIsLoading(true);

    let url;
    try {
      url = await apiService.backupsCreateUrl(backup.fileName);
    } catch (error) {
      console.error('BackupsListItem error when attempting to create backup URL', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setIsLoading(false);

    window.open(url);
  };

  const handleDeleteClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await apiService.backupsDelete(backup.fileName);
    } catch (error) {
      console.error('BackupsListItem error when attempting to delete backup', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setIsDeleted(true);
    setIsLoading(false);
  }

  return (
    <>
      <button disabled={isLoading || isDeleted} onClick={handleCreateUrlClick}>{new Date(backup.serverTimestamp * 1000).toString()}</button>
      {' '}
      ({Math.round(backup.size / 1024)} KB)
      <button disabled={isLoading || isDeleted} onClick={handleDeleteClick}>Delete</button>
      {isLoading && ' Loading...'}
      {isDeleted && ' Deleted'}
    </>
  );
};
