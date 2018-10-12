import { Moment, utc} from 'moment';
import {Currency} from '../../utils/currency/currency';

export class CustomerAnalytics {

  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  createdAt: Moment;
  updatedAt: Moment;
  orders: number;
  totalSaleAmount: Currency;
  returns: number;
  refunds: number;
  refundAmount: Currency;

  obj: any;

  constructor(obj?: any) {
    if (!obj) {
      obj = []
    }

    this.obj = obj;

    this.id = this.getValueOf('id');
    this.status = this.getValueOf('status');
    this.firstName = this.getValueOf('firstname');
    this.lastName = this.getValueOf('lastname');
    this.email = this.getValueOf('email');
    this.phone = this.getValueOf('phone');
    this.city = this.getValueOf('city');
    this.state = this.getValueOf('state');
    this.zip = this.getValueOf('zip');
    this.createdAt = utc(this.getValueOf('created_at'));
    this.updatedAt = utc(this.getValueOf('updated_at'));
    this.orders = +this.getValueOf('orders') || 0;
    this.totalSaleAmount = new Currency(this.getValueOf('total_sale_amount') || 0);
    this.returns = +this.getValueOf('returns') || 0;
    this.refunds = +this.getValueOf('refunds') || 0;
    this.refundAmount = new Currency(this.getValueOf('refund_amount') || 0);
  }

  private getValueOf(key): any {
    for (let i = 0; i < this.obj.length; i++) {
      if (this.obj[i].key === key) {
        return this.obj[i].value;
      }
    }

    return '';
  }

}