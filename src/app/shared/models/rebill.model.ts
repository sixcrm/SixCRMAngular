import {ParentSession} from './parent-session.model';
import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment'
import {RebillStateHistory} from './rebill-state-history.model';
import {ShippingReceipt} from './shipping-receipt.model';

export class Rebill implements Entity<Rebill> {
  id: string;
  amount: Currency;
  billAt: Moment;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  parentSession: ParentSession;
  productSchedules: ProductSchedule[] = [];
  transactions: Transaction[] = [];
  history: RebillStateHistory[] = [];
  shippingReceipts: ShippingReceipt[] = [];
  state: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.amount = new Currency(obj.amount);
    this.billAt = utc(obj.bill_at);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.parentSession = new ParentSession(obj.parentsession);
    this.state = obj.state || '';
    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(ps => new ProductSchedule(ps));
    }

    if (obj.transactions) {
      this.transactions = obj.transactions.map(t => new Transaction(t));
    }

    if (obj.shippingreceipts) {
      this.shippingReceipts = obj.shippingreceipts.map(r => new ShippingReceipt(r));
    }

    if (obj.history) {
      this.history = obj.history.map(h => new RebillStateHistory(h));
    }
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
      updated_at: this.updatedAtAPI,
      parentsession: this.parentSession.inverse(),
      product_schedules: this.productSchedules.map(p => p.inverse()),
      shippingreceipts: this.shippingReceipts.map(r => r.inverse()),
      transactions: this.transactions.map(t => t.inverse()),
      state: this.state
    }
  }

}
