import {AclAccount} from './acl-account.model';
import {AclRole} from './acl-role.model';

export class Acl {
  signature: string;
  account: AclAccount;
  role: AclRole;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.signature = obj.signature || '';
    this.account = new AclAccount(obj.account);
    this.role = new AclRole(obj.role);
  }

  inverse(): any {
    return {
      signature: this.signature,
      account: this.account.inverse(),
      role: this.role.inverse()
    }
  }
}
