import {Customer} from './customer.model';
import {Entity} from './entity.interface';
import {Campaign} from './campaign.model';

export class ParentSession implements Entity<ParentSession> {
  id: string;
  customer: Customer;
  campaign: Campaign;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
    this.campaign = new Campaign(obj.campaign);
  }

  copy(): ParentSession {
    return new ParentSession(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      customer: this.customer.inverse(),
      campaign: this.campaign.inverse()
    }
  }
}
