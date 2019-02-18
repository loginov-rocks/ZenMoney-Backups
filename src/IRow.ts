export default interface IRow {
  date: Date | undefined;
  income: number | undefined;
  incomeAccountName: string | undefined;
  incomeCurrencyShortTitle: string | undefined;
  outcome: number | undefined;
  outcomeAccountName: string | undefined;
  outcomeCurrencyShortTitle: string | undefined;
  categoryName: string | undefined;
  payee: string | undefined;
  comment: string | undefined;
  createdDate: Date | undefined;
  changedDate: Date | undefined;
}
