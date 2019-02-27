#!/usr/bin/env node

import * as program from 'commander';

program
  .version('0.1.0')
  .command('accounts', 'List accounts')
  .command('sum', 'Calculate sum')
  .parse(process.argv);
