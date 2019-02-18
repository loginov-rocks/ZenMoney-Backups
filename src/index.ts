#!/usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import { csvToRowsArray, merge } from './rows';

const DATA_DIR = path.resolve(__dirname, '..', 'data');

const fileNames = fs.readdirSync(DATA_DIR);

process.stdout.write(`${fileNames.length} files found:\n`);
fileNames.forEach(fileName => process.stdout.write(`${fileName}\n`));

const transformPromises = fileNames.map(fileName => csvToRowsArray(path.join(DATA_DIR, fileName)));

Promise.all(transformPromises)
  .then(arrayOfRowsArrays => merge(arrayOfRowsArrays))
  .then((rowsArray) => {
    process.stdout.write(JSON.stringify(rowsArray, null, 2));

    const accounts: { [index: string]: number } = {};

    rowsArray.forEach((row) => {
      if (row.outcomeAccountName && row.outcome) {
        if (!accounts[row.outcomeAccountName]) {
          accounts[row.outcomeAccountName] = 0;
        }

        accounts[row.outcomeAccountName] -= row.outcome;
      }

      if (row.incomeAccountName && row.income) {
        if (!accounts[row.incomeAccountName]) {
          accounts[row.incomeAccountName] = 0;
        }

        accounts[row.incomeAccountName] += row.income;
      }
    });

    process.stdout.write(JSON.stringify(accounts, null, 2));
  })
  .catch((error) => {
    process.stdout.write(`Error! ${error}`);
  });

program
  .version('0.1.0')
  .description('ZenMoney Portfolio Calculator')
  .parse(process.argv);
