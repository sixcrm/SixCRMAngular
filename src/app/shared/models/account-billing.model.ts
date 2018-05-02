export class AccountBilling {
  plan: string;
  disabled: boolean;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.plan = obj.plan;
    this.disabled = !!obj.disabled;
  }

  inverse(): any {
    return {
      plan: this.plan,
      disabled: this.disabled
    }
  }

  copy(): AccountBilling {
    return new AccountBilling(this.inverse());
  }
}
