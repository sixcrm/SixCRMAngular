import {Moment, utc} from 'moment';

export class AccountBilling {
  plan: string;
  deactivatedAt: Moment;
  limitedAt: Moment;
  session: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.plan = obj.plan;
    this.session = obj.session;
    this.deactivatedAt = !!obj.deactivated_at ? utc(obj.deactivated_at) : null;
    this.limitedAt = !!obj.limited_at ? utc(obj.limited_at) : null;
  }

  inverse(): any {
    return {
      plan: this.plan,
      session: this.session,
      deactivated_at: this.deactivatedAt ? this.deactivatedAt.format() : null,
      limited_at: this.limitedAt ? this.limitedAt.format() : null
    }
  }

  copy(): AccountBilling {
    return new AccountBilling(this.inverse());
  }
}
