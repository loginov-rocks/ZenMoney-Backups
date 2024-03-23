import { useEffect, useState } from 'react';

import apiService from '../services/Api';
import { ListItem } from './ListItem';

export const List = () => {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const listBackups = async (): Promise<void> => {
    let backups;
    try {
      backups = await apiService.list();
    } catch (error) {
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

  if (isLoading) {
    return (
      <>
        <h2>List</h2>
        <p>Loading...</p>
      </>
    );
  }

  if (backups.length === 0) {
    return (
      <>
        <h2>List</h2>
        <p>No backups found</p>
      </>
    );
  }

  return (
    <>
      <h2>List</h2>
      <ul>
        {backups.map((backup, index) => (
          <li key={index}>
            <ListItem backup={backup} />
          </li>
        ))}
      </ul>
    </>
  );
}
