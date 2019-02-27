import chalk from 'chalk';

export const error = (message: string) => process.stdout.write(chalk.red(message));

export const info = (message: string) => process.stdout.write(chalk.blue(message));

export const result = (message: string) => process.stdout.write(chalk.green(message));
