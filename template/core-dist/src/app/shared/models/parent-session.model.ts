import {Customer} from './customer.model';

export class ParentSession {
  id: string;
  customer: Customer;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
  }
}
