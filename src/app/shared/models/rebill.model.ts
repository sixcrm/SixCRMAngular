import {ProductSchedule} from './product-schedule.model';
import {Transaction} from './transaction.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment'
import {RebillStateHistory} from './rebill-state-history.model';
import {ShippingReceipt} from './shipping-receipt.model';
import {Products} from './products.model';
import {firstIndexOf} from '../utils/array.utils';
import {RebillPaidStatus} from './rebill-paid-status.model';
import {Session} from './session.model';

export class Rebill implements Entity<Rebill> {
  id: string;
  amount: Currency;
  alias: string;
  billAt: Moment;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  parentSession: Session;
  productSchedules: ProductSchedule[] = [];
  products: Products[] = [];
  transactions: Transaction[] = [];
  history: RebillStateHistory[] = [];
  shippingReceipts: ShippingReceipt[] = [];
  state: string;
  paid: RebillPaidStatus;
  cycle: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.amount = new Currency(obj.amount);
    this.alias = obj.alias || '';
    this.billAt = utc(obj.bill_at);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.parentSession = new Session(obj.parentsession);
    this.state = obj.state || '';
    this.cycle = obj.cycle || 0;

    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(ps => new ProductSchedule(ps));
    }

    if (obj.products) {
      this.products = obj.products.map(p => new Products(p));
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

    if (obj.paid) {
      this.paid = new RebillPaidStatus(this.paid);
    }
  }

  hasChargeback() {
    return this.transactions && (firstIndexOf(this.transactions.filter(t => t.isSuccess()), (t) => t.chargeback) !== -1);
  }

  isSuccess() {
    return !this.isError() && !this.isPartialSuccess()
  }

  isPartialSuccess() {
    if (this.isError()) return false;

    const numOfSuccess = this.transactions.filter(t => t.isSuccess()).length;

    return numOfSuccess > 0 && numOfSuccess < this.transactions.length;
  }

  isError() {
    return !this.transactions || this.transactions.filter(t => t.isSuccess()).length === 0;
  }

  hasRefund() {
    return this.transactions && (firstIndexOf(this.transactions.filter(t => t.isSuccess()), (t) => t.isRefund()) !== -1);
  }

  refundedAmount(): Currency {
    if (!this.transactions) return new Currency(0);

    return new Currency(
      this.transactions.filter(t => !t.isError() && t.isRefund()).map(t => t.amount.amount).reduce((a,b) => a+b,0)
    )
  }

  successAmount(): Currency {
    return new Currency(
      this.transactions
        .filter(t => t.isSuccess() && !t.isRefund() && !t.isChargeback())
        .map(t => t.amount.amount)
        .reduce((a,b) => a + b, 0)
    )
  }

  chargebackAmount(): Currency {
    if (!this.transactions) return new Currency(0);

    return new Currency(
      this.transactions.filter(t => !t.isError() && t.chargeback).map(t => t.amount.amount).reduce((a,b) => a+b,0)
    )
  }

  copy(): Rebill {
    return new Rebill(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      amount: this.amount.amount,
      alias: this.alias,
      bill_at: this.billAt.clone().format(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI,
      parentsession: this.parentSession.inverse(),
      products: this.products.map(p => p.inverse()),
      product_schedules: this.productSchedules.map(p => p.inverse()),
      shippingreceipts: this.shippingReceipts.map(r => r.inverse()),
      transactions: this.transactions.map(t => t.inverse()),
      state: this.state,
      paid: this.paid ? this.paid.inverse() : null,
      cycle: this.cycle
    }
  }

}
