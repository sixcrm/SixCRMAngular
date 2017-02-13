import {Customer} from './customer.model';
import {Entity} from './entity.interface';

export class ParentSession implements Entity<ParentSession> {
  id: string;
  customer: Customer;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
  }

  copy(): ParentSession {
    return null;
  }
}
