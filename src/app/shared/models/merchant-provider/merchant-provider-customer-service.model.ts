export class MerchantProviderCustomerService {
  url: string;
  description: string;
  email: string;
  phone: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.url = obj.url || '';
    this.description = obj.description || '';
    this.email = obj.email || '';
    this.phone = obj.phone || '';
  }

  copy(): MerchantProviderCustomerService {
    return new MerchantProviderCustomerService(this.inverse());
  }

  inverse(): any {
    return {
      url: this.url,
      description: this.description,
      email: this.email,
      phone: this.phone
    }
  }
}
