import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment';
import {Products} from './products.model';
import {Rebill} from './rebill.model';
import {Session} from './session.model';

export class Order {

  id: string;
  amount: Currency;
  date: Moment;
  products: Products[] = [];
  rebill: Rebill;
  session: Session;

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
    const transactions = this.rebill.transactions.filter(t => t.type === 'sale').length;
    const refunded = this.rebill.transactions.filter(t => t.type === 'refund').length;

    return transactions > refunded;
  }

  canReturn(): boolean {
    return this.products.filter(p => p.product.ship && (!p.returns || p.returns.length === 0)).length > 0;
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
