import {MerchantProvider} from './merchant-provider.model';

export class MerchantProviderConfiguration {
  distribution: string;
  merchantProvider: MerchantProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.distribution = obj.distribution || '';
    this.merchantProvider = new MerchantProvider(obj.merchantprovider);
  }
}
