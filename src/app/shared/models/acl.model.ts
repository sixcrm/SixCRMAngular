import {Account} from './account.model';
import {Role} from './role.model';
import {User} from './user.model';

export class Acl {
  signature: string;
  id: string;
  pending: string;
  user: User;
  account: Account;
  role: Role;
  termsAndConditionsOutdated: boolean;

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
      termsandconditions_outdated: this.termsAndConditionsOutdated
    }
  }
}
