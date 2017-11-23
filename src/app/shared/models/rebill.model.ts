import {ParentSession} from './parent-session.model';
import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment'

export interface RebillStateHistory {
  name: string;
  enter?: Moment;
  exit?: Moment;
  errorMessage?: string;
}

export class Rebill implements Entity<Rebill> {
  id: string;
  amount: Currency;
  billAt: Moment;
  createdAt: Moment;
  parentSession: ParentSession;
  productSchedules: ProductSchedule[] = [];
  transactions: Transaction[] = [];
  history: RebillStateHistory[] = [];

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

    this.generateHistory();
  }

  copy(): Rebill {
    return new Rebill(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      amount: this.amount.amount,
      bill_at: this.billAt.clone().format(),
      created_at: this.createdAt.clone().format(),
      parentsession: this.parentSession.inverse(),
      product_schedules: this.productSchedules.map(p => p.inverse()),
      transactions: this.transactions.map(t => t.inverse())
    }
  }

  generateHistory() {
    this.history = [
      {name: 'bill', enter: utc(), exit: utc()},
      {name: 'hold', enter: utc(), exit: utc()},
      {name: 'pending', enter: utc(), exit: utc()},
      {name: 'shipped', enter: utc(), errorMessage: 'Cannot locate package'},
      {name: 'delivered'},
    ]
  }
}
