import { convert } from '../currencies';
import IAccount from '../interfaces/IAccount';
import ITransaction from '../interfaces/ITransaction';
import TCurrency from '../types/TCurrency';

export default async (transactions: ITransaction[]): Promise<IAccount[]> => {
  const accounts: { [index: string]: { balance: number, currency: TCurrency } } = {};

  for (const t of transactions) {
    if (t.income && t.incomeAccountName && t.incomeCurrencyShortTitle) {
      if (!accounts[t.incomeAccountName]) {
        accounts[t.incomeAccountName] = {
          balance: 0,
          currency: t.incomeCurrencyShortTitle,
        };
      }

      accounts[t.incomeAccountName].balance += await convert(
        t.income,
        t.incomeCurrencyShortTitle,
        accounts[t.incomeAccountName].currency,
        t.date,
      );
    }

    if (t.outcome && t.outcomeAccountName && t.outcomeCurrencyShortTitle) {
      if (!accounts[t.outcomeAccountName]) {
        accounts[t.outcomeAccountName] = {
          balance: 0,
          currency: t.outcomeCurrencyShortTitle,
        };
      }

      accounts[t.outcomeAccountName].balance -= await convert(
        t.outcome,
        t.outcomeCurrencyShortTitle,
        accounts[t.outcomeAccountName].currency,
        t.date,
      );
    }
  }

  return Object.keys(accounts).map(name => ({
    balance: accounts[name].balance,
    currency: accounts[name].currency,
    name, // tslint:disable-line
  }));
};
