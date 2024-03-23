import { AuthGate } from './AuthGate';
import { List } from './List';
import { ZenMoneyAuthGate } from './ZenMoneyAuthGate';

export const App = () => {
  return (
    <>
      <h1>ZenMoney Backups</h1>
      <AuthGate>
        <ZenMoneyAuthGate>
          <List />
        </ZenMoneyAuthGate>
      </AuthGate>
    </>
  );
};
