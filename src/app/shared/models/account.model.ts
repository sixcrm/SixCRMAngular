import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {Acl} from './acl.model';

export class Account implements Entity<Account> {

  id: string;
  name: string;
  active: boolean;
  acls: Acl[];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active;

    this.acls = [];
    if (obj.acl) {
      this.acls = obj.acl.map(acl => new Acl(acl));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  toggleActive(): void {
    this.active = !this.active;
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
      updated_at: this.updatedAtAPI
    }
  }
}
