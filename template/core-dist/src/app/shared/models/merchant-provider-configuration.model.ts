import {MerchantProvider} from './merchant-provider.model';
import {Entity} from './entity.interface';

export class MerchantProviderConfiguration implements Entity<MerchantProviderConfiguration> {
  distribution: string;
  merchantProvider: MerchantProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.distribution = obj.distribution || '';
    this.merchantProvider = new MerchantProvider(obj.merchantprovider);
  }

  copy(): MerchantProviderConfiguration {
    return new MerchantProviderConfiguration(this.inverse());
  }

  inverse(): any {
    return {
      distribution: this.distribution,
      merchantprovider: this.merchantProvider.inverse()
    }
  }
}
