import { AuthGate } from './AuthGate';
import { BackupsList } from './BackupsList';
import { ZenMoneyAuthGate } from './ZenMoneyAuthGate';

export const App = () => {
  return (
    <>
      <h1>ZenMoney Backups</h1>
      <AuthGate>
        <ZenMoneyAuthGate>
          <BackupsList />
        </ZenMoneyAuthGate>
      </AuthGate>
    </>
  );
};
