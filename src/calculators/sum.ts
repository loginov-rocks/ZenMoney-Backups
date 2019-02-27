import { convert } from '../currencies';
import ITransaction from '../interfaces/ITransaction';
import TCurrency from '../types/TCurrency';

export default async (transactions: ITransaction[], currency: TCurrency): Promise<number> => {
  let sum = 0;

  for (const t of transactions) {
    if (t.income && t.incomeCurrencyShortTitle) {
      sum += await convert(t.income, t.incomeCurrencyShortTitle, currency, t.date);
    }

    if (t.outcome && t.outcomeCurrencyShortTitle) {
      sum -= await convert(t.outcome, t.outcomeCurrencyShortTitle, currency, t.date);
    }
  }

  return sum;
};
