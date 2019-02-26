import TCurrency from '../types/TCurrency';

export const getRate = async (from: TCurrency, to: TCurrency, date?: Date): Promise<number> => {
  // TODO: Fetch rates for the date specified or the current otherwise.
  if (from === 'USD' && to === 'RUB') {
    return 65;
  }

  if (from === 'RUB' && to === 'USD') {
    return 1 / 65;
  }

  if (from === 'EUR' && to === 'RUB') {
    return 75;
  }

  if (from === 'RUB' && to === 'EUR') {
    return 1 / 75;
  }

  return 1;
};

export const convert = async (amount: number, from: TCurrency, to: TCurrency, date?: Date):
  Promise<number> => {
  const rate = await getRate(from, to, date);

  return amount * rate;
};
