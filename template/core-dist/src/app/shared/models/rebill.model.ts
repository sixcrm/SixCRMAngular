import {ParentSession} from './parent-session.model';
import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';

export class Rebill {
  id: string;
  billDate: string;
  amount: string;
  parentSession: ParentSession;
  productSchedules: ProductSchedule[] = [];
  transactions: Transaction[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.billDate = obj.billdate || '';
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
}
