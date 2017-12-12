import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment';

export class BillDetails {
  description: string;
  amount: Currency;
  createdAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.description = obj.description || '';
    this.amount = new Currency(obj.amount);
    this.createdAt = utc(obj.created_at);
  }

  copy(): BillDetails {
    return new BillDetails(this.inverse());
  }

  inverse(): any {
    return {
      amount: this.amount.amount,
      description: this.description,
      created_at: this.createdAt.clone().format()
    }
  }
}
