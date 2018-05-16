import {Currency} from '../utils/currency/currency';

export class SubscriptionStats {
  subscription: string;
  subscription_name: string;
  amount: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.subscription = this.getValueOf('product_schedule') || '';
    this.subscription_name = this.getValueOf('product_schedule_name') || '';
    this.amount = new Currency(this.getValueOf('amount'));
  }

  private getValueOf(key): any {
    let array = this.obj.filter(o => o.key === key);

    if (array.length < 1) {
      return '';
    }

    return array[0].value;
  }
}
