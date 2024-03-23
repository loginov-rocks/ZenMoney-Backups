import { AuthGate } from './AuthGate';
import { ZenMoneyAuthGate } from './ZenMoneyAuthGate';

export const App = () => {
  return (
    <>
      <h1>ZenMoney Backups</h1>
      <AuthGate>
        <ZenMoneyAuthGate>
          Authorized!
        </ZenMoneyAuthGate>
      </AuthGate>
    </>
  );
};
