import {ParentSession} from './parent-session.model';
import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';
import {Entity} from './entity.interface';

export class Rebill implements Entity<Rebill> {
  id: string;
  billAt: string;
  amount: string;
  parentSession: ParentSession;
  productSchedules: ProductSchedule[] = [];
  transactions: Transaction[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.billAt = obj.bill_at || '';
    this.amount = obj.amount || '';
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
    return null;
  }
}
