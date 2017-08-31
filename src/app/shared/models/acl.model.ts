import {Account} from './account.model';
import {Role} from './role.model';
import {User} from './user.model';

export class Acl {
  signature: string;
  id: string;
  user: User;
  account: Account;
  role: Role;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.signature = obj.signature || '';
    this.user = new User(obj.user);
    this.account = new Account(obj.account);
    this.role = new Role(obj.role);
  }

  inverse(): any {
    return {
      id: this.id,
      signature: this.signature,
      user: this.user.inverse(),
      account: this.account.inverse(),
      role: this.role.inverse()
    }
  }
}
