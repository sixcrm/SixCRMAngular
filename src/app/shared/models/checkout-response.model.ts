import {Session} from './session.model';
import {Customer} from './customer.model';
import {Transaction} from './transaction.model';

export class CheckoutResponse {
  session: Session;
  customer: Customer;
  transactions: Transaction[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.session = new Session(obj.session);
    this.customer = new Customer(obj.customer);
    this.transactions = (obj.transactions || []).map(t => new Transaction(t));
  }
}
