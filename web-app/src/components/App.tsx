import { AuthGate } from './AuthGate';
import { BackupsList } from './BackupsList';
import { ZenMoneyAuthorization } from './ZenMoneyAuthorization';

export const App = () => {
  return (
    <>
      <h1>ZenMoney Backups</h1>
      <AuthGate>
        <ZenMoneyAuthorization />
        <hr />
        <BackupsList />
      </AuthGate>
    </>
  );
};
