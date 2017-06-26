export class MerchantProviderGateway {
  name: string;
  endpoint: string;
  username: string;
  password: string;
  additional: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.endpoint = obj.endpoint || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.additional = obj.additional || '';
  }

  copy(): MerchantProviderGateway {
    return new MerchantProviderGateway(this.inverse());
  }

  inverse(): any {
    return {
      name: this.name,
      endpoint: this.endpoint,
      username: this.username,
      password: this.password,
      additional: this.additional
    }
  }
}
