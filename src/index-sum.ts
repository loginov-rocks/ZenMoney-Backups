import sum from './calculators/sum';
import getTransactions from './getTransactions';
import * as log from './helpers/log';
import { removeExternalTransactions } from './transactions/filters';
import TCurrency from './types/TCurrency';

// TODO: Pass currency as an option.
const currency: TCurrency = 'RUB';

getTransactions()
  .then(transactions => removeExternalTransactions(transactions))
  .then(transactions => sum(transactions, currency))
  .then((s) => {
    log.result(`Sum: ${s.toFixed(2)} ${currency}\n`);
  })
  .catch((error) => {
    log.error(`Error! ${error}\n`);
  });
