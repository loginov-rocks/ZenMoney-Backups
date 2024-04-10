import { useEffect, useState } from 'react';

import apiService from '../services/Api';
import { Backup } from '../services/Api/Api';

import { BackupsListItem } from './BackupsListItem';

export const BackupsList = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const listBackups = async (): Promise<void> => {
    let backups;
    try {
      backups = await apiService.backupsList();
    } catch (error) {
      console.error('BackupsList error when attempting to list backups', error);
      setIsLoading(false);
      alert(error);

      return;
    }

    setBackups(backups);
    setIsLoading(false);
  };

  useEffect(() => {
    listBackups();
  }, []);

  const renderBackups = (): React.ReactNode => {
    if (backups.length === 0) {
      return <p>No backups found</p>;
    }

    return (
      <ul>
        {backups.map((backup, index) => (
          <li key={index}>
            <BackupsListItem backup={backup} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <h2>Backups List</h2>
      {isLoading
        ? <p>Loading...</p>
        : renderBackups()}
    </>
  );
};
