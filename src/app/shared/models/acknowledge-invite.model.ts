export class AcknowledgeInvite {
  hash: string;
  email: string;
  acl: string;
  invitor: string;
  account: string;
  accountName: string;
  role: string;
  signature: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.hash = obj.hash || '';
    this.email = obj.email || '';
    this.acl = obj.acl || '';
    this.invitor = obj.invitor || '';
    this.account = obj.account || '';
    this.accountName = obj.account_name || '';
    this.role = obj.role || '';
    this.signature = obj.signature || '';
  }
}
