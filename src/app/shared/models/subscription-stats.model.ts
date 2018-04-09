import {Currency} from '../utils/currency/currency';

export class SubscriptionStats {
  subscription: string;
  amount: Currency;

  constructor(obj?: any) {
    if (!obj) {
      obj = {}
    }

    this.subscription = obj.subscription || '';
    this.amount = new Currency(obj.amount);
  }
}
