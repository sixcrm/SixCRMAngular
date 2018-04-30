import {Customer} from './customer.model';
import {Entity} from './entity.interface';
import {Campaign} from './campaign.model';
import {Moment, utc} from 'moment';

export class ParentSession implements Entity<ParentSession> {
  id: string;
  alias: string;
  customer: Customer;
  campaign: Campaign;
  createdAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.customer = new Customer(obj.customer);
    this.campaign = new Campaign(obj.campaign);
    this.createdAt = utc(obj.created_at);
  }

  copy(): ParentSession {
    return new ParentSession(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      alias: this.alias,
      created_at: this.createdAt.format(),
      customer: this.customer.inverse(),
      campaign: this.campaign.inverse()
    }
  }
}
