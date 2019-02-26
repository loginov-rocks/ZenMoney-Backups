import ITransaction from '../interfaces/ITransaction';

export const byDate = ({ date: a }: ITransaction, { date: b }: ITransaction): number => {
  // If A undefined or less than B, A goes first.
  if (!a || (b && a < b)) {
    return -1;
  }

  // If A defined and B undefined or less than A, B goes first.
  if (!b || a > b) {
    return 1;
  }

  // Otherwise nothing changes.
  return 0;
};
