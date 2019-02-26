import ITransaction from '../interfaces/ITransaction';

export const merge = (arrayOfTransactionsArrays: ITransaction[][]): ITransaction[] => {
  const firstTransactionsArray = arrayOfTransactionsArrays.shift() || [];

  return firstTransactionsArray.concat(...arrayOfTransactionsArrays);
};
