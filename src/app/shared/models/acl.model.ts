import {Account} from './account.model';
import {Role} from './role.model';
import {User} from './user.model';
import {utc, Moment} from 'moment';

export class Acl {
  signature: string;
  id: string;
  pending: string;
  user: User;
  account: Account;
  role: Role;
  termsAndConditionsOutdated: boolean;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.pending = obj.pending || '';
    this.signature = obj.signature || '';
    this.user = new User(obj.user);
    this.account = new Account(obj.account);
    this.role = new Role(obj.role);
    this.termsAndConditionsOutdated = !!obj.termsandconditions_outdated;
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): Acl {
    return new Acl(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      pending: this.pending,
      signature: this.signature,
      user: this.user.inverse(),
      account: this.account.inverse(),
      role: this.role.inverse(),
      termsandconditions_outdated: this.termsAndConditionsOutdated,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
