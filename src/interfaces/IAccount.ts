import TCurrency from '../types/TCurrency';

export default interface IAccount {
  balance: number;
  currency: TCurrency;
  name: string;
}
