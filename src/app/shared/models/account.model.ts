import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class Account implements Entity<Account> {

  id: string;
  name: string;
  active: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  toggleActive(): void {
    this.active = this.active === 'true' ? 'false' : 'true';
  }

  copy(): Account {
    return new Account(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      active: this.active,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
