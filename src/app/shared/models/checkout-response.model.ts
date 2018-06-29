import {Session} from './session.model';
import {Customer} from './customer.model';
import {Order} from './order.model';

export class CheckoutResponse {
  session: Session;
  customer: Customer;
  orders: Order[] = [];
  success: boolean;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.session = new Session(obj.session);
    this.customer = new Customer(obj.customer);
    this.orders = (obj.orders || []).map(t => new Order(t));
  }

  withSuccess(success: boolean): CheckoutResponse {
    this.success = success;
    return this;
  }
}
