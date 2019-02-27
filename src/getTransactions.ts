import * as fs from 'fs';
import * as path from 'path';

import * as log from './helpers/log';
import ITransaction from './interfaces/ITransaction';
import { byDate } from './transactions/comparators';
import { merge } from './transactions/operators';
import { csvToTransactionsArray } from './transactions/transformers';

export default async (): Promise<ITransaction[]> => {
  const dir = path.resolve(__dirname, '..', 'data');

  log.info(`Getting transactions from files located in "${dir}"...\n`);

  const filenames = fs.readdirSync(dir);

  log.info(`${filenames.length} file${filenames.length > 1 ? 's' : ''} found:\n`);

  filenames.forEach(fileName => log.info(`${fileName}\n`));

  const transformPromises = filenames.map(fileName =>
    csvToTransactionsArray(path.join(dir, fileName)));

  const arrayOfTransactionsArrays = await Promise.all(transformPromises);

  const transactions = merge(arrayOfTransactionsArrays).sort(byDate);

  log.info(`${transactions.length} transaction${transactions.length > 1 ? 's' : ''} found\n`);

  return transactions;
};
