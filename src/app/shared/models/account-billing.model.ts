import {Moment, utc} from 'moment';

export class AccountBilling {
  plan: string;
  disable: Moment;
  session: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.plan = obj.plan;
    this.session = obj.session;
    // this.disable = !!obj.disable ? utc(obj.disable) : null;
    this.disable = utc().add(5, 'd');
  }

  inverse(): any {
    return {
      plan: this.plan,
      disable: this.disable,
      session: this.session
    }
  }

  copy(): AccountBilling {
    return new AccountBilling(this.inverse());
  }
}
