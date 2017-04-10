import {Customer} from './customer.model';
import {User} from './user.model';

export class CustomerNote {

  id: string;
  customer: Customer;
  user: User;
  account: string;
  body: string;
  createdAt: string;
  updatedAt: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
    this.user = new User(obj.user);
    this.account = obj.account;
    this.body = obj.body || '';
    this.createdAt = obj.created_at || '';
    this.updatedAt = obj.updated_at || '';
  }

}
