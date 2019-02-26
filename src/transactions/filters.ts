import ITransaction from '../interfaces/ITransaction';

export const removeExternalTransactions = (transactions: ITransaction[]): ITransaction[] =>
  transactions.filter(t => !t.categoryName && t.comment !== 'exchange');
