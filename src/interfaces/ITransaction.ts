import TCurrency from '../types/TCurrency';

export default interface ITransaction {
  date: Date | undefined;
  income: number | undefined;
  incomeAccountName: string | undefined;
  incomeCurrencyShortTitle: TCurrency | undefined;
  outcome: number | undefined;
  outcomeAccountName: string | undefined;
  outcomeCurrencyShortTitle: TCurrency | undefined;
  categoryName: string | undefined;
  payee: string | undefined;
  comment: string | undefined;
  createdDate: Date | undefined;
  changedDate: Date | undefined;
}
