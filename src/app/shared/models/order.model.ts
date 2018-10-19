import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment';
import {Products} from './products.model';
import {Rebill} from './rebill.model';
import {Session} from './session.model';
import {Transaction} from './transaction.model';

export class Order {

  id: string;
  amount: Currency;
  date: Moment;
  products: Products[] = [];
  rebill: Rebill;
  session: Session;
  transactions: Transaction;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.amount = new Currency(obj.amount || 0);
    this.date = utc(obj.date);
    this.products = (obj.products || []).map(p => new Products(p));
    this.rebill = new Rebill(obj.rebill);
    this.session = new Session(obj.session);
    this.transactions = (obj.transactions || []).map(t => new Transaction(t));
  }

  hasChargeback() {
    return this.rebill.hasChargeback();
  }

  hasRefund() {
    return this.rebill.hasRefund();
  }

  refundedAmount(): Currency {
    return this.rebill.refundedAmount();
  }

  chargebackAmount(): Currency {
    return this.rebill.chargebackAmount();
  }

  amountAfterRefund(): Currency {
    if (this.refundedAmount().amount === 0) return this.amount;

    return new Currency(this.amount.amount - this.refundedAmount().amount);
  }

  getReturned(): Products[] {
    if (!this.products || this.products.length === 0) return [];

    return this.products.filter(p => p.returns && p.returns.length > 0);
  }

  amountTotal(): Currency {
    const refunded = this.refundedAmount().amount;
    const chargebacked = this.chargebackAmount().amount;

    return new Currency(this.amount.amount - refunded - chargebacked);
  }

  canRefund(): boolean {
    for (let transaction of this.rebill.transactions) {
      if (transaction.isRefundable()) return true;
    }

    return false;
  }

  canReturn(): boolean {
    for (let product of this.products) {
      if (product.isReturnable()) return true;
    }

    return false;
  }

  copy(): Order {
    return new Order(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      amount: this.amount.amount,
      date: this.date.clone().format(),
      products: this.products.map(p => p.inverse()),
      rebill: this.rebill.inverse(),
      session: this.session.inverse()
    }
  }

}
