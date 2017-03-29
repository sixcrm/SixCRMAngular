import {Account} from './account.model';
import {Role} from './role.model';

export class Acl {
  signature: string;
  account: Account;
  role: Role;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.signature = obj.signature || '';
    this.account = new Account(obj.account);
    this.role = new Role(obj.role);
  }

  inverse(): any {
    return {
      signature: this.signature,
      account: this.account.inverse(),
      role: this.role.inverse()
    }
  }
}
