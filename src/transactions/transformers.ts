import * as csvToJson from 'csvtojson';

import ITransaction from '../interfaces/ITransaction';

export const csvToTransactionsArray = async (filePath: string): Promise<ITransaction[]> => {
  const json = await csvToJson().fromFile(filePath);

  // First row is an object containing headers.
  const headers = json.shift();

  return json.map((row) => {
    const transaction: { [index: string]: Date | number | string | undefined } = {};

    Object.keys(headers).forEach((key) => {
      const col = headers[key];
      const val = row[key];

      if (val === '') {
        transaction[col] = undefined;
      } else if (col === 'date' || col === 'createdDate' || col === 'changedDate') {
        transaction[col] = new Date(val);
      } else if (col === 'income' || col === 'outcome') {
        transaction[col] = parseFloat(val.replace(',', '.'));
      } else {
        transaction[col] = val;
      }
    });

    return transaction as any as ITransaction;
  });
};
