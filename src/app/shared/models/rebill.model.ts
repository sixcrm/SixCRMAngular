import {ParentSession} from './parent-session.model';
import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {Currency} from '../utils/currency/currency';

export class Rebill implements Entity<Rebill> {
  id: string;
  amount: Currency;
  billAt: Moment;
  createdAt: Moment;
  parentSession: ParentSession;
  productSchedules: ProductSchedule[] = [];
  transactions: Transaction[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.amount = new Currency(obj.amount);
    this.billAt = utc(obj.bill_at);
    this.createdAt = utc(obj.created_at);
    this.parentSession = new ParentSession(obj.parentsession);

    if (obj.product_schedules) {
      for (let i = 0; i < obj.product_schedules.length; i++) {
        this.productSchedules.push(new ProductSchedule(obj.product_schedules[i]));
      }
    }

    if (obj.transactions) {
      for (let i = 0; i < obj.transactions.length; i++) {
        this.transactions.push(new Transaction(obj.transactions[i]));
      }
    }
  }

  copy(): Rebill {
    return JSON.parse(JSON.stringify(this));
  }
}
