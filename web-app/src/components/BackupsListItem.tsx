import { FC, useState } from 'react';

import apiService from '../services/Api';
import { Backup } from '../services/Api/Api';

interface Props {
  backup: Backup;
  index: number;
}

export const BackupsListItem: FC<Props> = ({ backup, index }) => {
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

  const dateTime = new Date(backup.serverTimestamp * 1000).toString();

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{isDeleted ? <s>{dateTime}</s> : dateTime}</td>
      <td>
        {isLoading
          ? 'Loading...'
          : (isDeleted
            ? 'Deleted'
            : (
              <>
                <button disabled={isDeleted} onClick={handleCreateUrlClick}>Download</button>
                {' '}
                <button disabled={isDeleted} onClick={handleDeleteClick}>Delete</button>
              </>
            ))}
      </td>
      <td>{Math.round(backup.size / 1024)} KB</td>
    </tr>
  );
};
