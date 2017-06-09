import {Customer} from './customer.model';
import {User} from './user.model';
import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';

export class CustomerNote implements Entity<CustomerNote>{

  id: string;
  customer: Customer;
  user: User;
  account: string;
  body: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
    this.user = new User(obj.user);
    this.account = obj.account;
    this.body = obj.body || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): CustomerNote {
    return null;
  }

}
