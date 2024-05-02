import { AuthGate } from './AuthGate';
import { BackupsList } from './BackupsList';
import { ZenMoneyAuthGate } from './ZenMoneyAuthGate';
import { ZenMoneyUnauthorizeButton } from './ZenMoneyUnauthorizeButton';

export const App = () => {
  return (
    <>
      <h1>ZenMoney Backups</h1>
      <AuthGate>
        <ZenMoneyAuthGate>
          <ZenMoneyUnauthorizeButton />
          <BackupsList />
        </ZenMoneyAuthGate>
      </AuthGate>
    </>
  );
};
