export class MerchantProviderCustomerService {
  url: string;
  description: string;
  email: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.url = obj.url || '';
    this.description = obj.description || '';
    this.email = obj.email || '';
  }

  copy(): MerchantProviderCustomerService {
    return new MerchantProviderCustomerService(this.inverse());
  }

  inverse(): any {
    return {
      url: this.url,
      description: this.description,
      email: this.email
    }
  }
}
