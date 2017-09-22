export class MerchantProviderGateway {
  name: string;
  processorId: string;
  endpoint: string;
  username: string;
  password: string;
  additional: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.processorId = obj.processor_id || '';
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
      processor_id: this.processorId,
      endpoint: this.endpoint,
      username: this.username,
      password: this.password,
      additional: this.additional
    }
  }
}
