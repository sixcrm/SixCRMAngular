import {Entity} from './entity.interface';

export class Account implements Entity<Account> {

  id: string;
  name: string;
  active: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active || '';
  }

  copy(): Account {
    return new Account(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      active: this.active
    }
  }
}
