export class AccountBilling {
  plan: string;
  disable: boolean;
  session: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.plan = obj.plan;
    this.session = obj.session;
    this.disable = !!obj.disable;
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
