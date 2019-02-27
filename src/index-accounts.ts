import accounts from './calculators/accounts';
import getTransactions from './getTransactions';
import * as log from './helpers/log';

getTransactions()
  .then(transactions => accounts(transactions))
  .then((as) => {
    log.result('Account\tBalance\tCurrency\n');

    as.forEach((a) => {
      log.result(`${a.name}\t${a.balance.toFixed(2)}\t${a.currency}\n`);
    });
  })
  .catch((error) => {
    log.error(`Error! ${error}`);
  });
