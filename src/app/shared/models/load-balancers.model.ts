import {MerchantProviderConfiguration} from './merchant-provider-configuration.model';
import {Entity} from './entity.interface';

export class LoadBalancer implements Entity<LoadBalancer> {
  id: string;
  merchantProviderConfigurations: MerchantProviderConfiguration[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    if (obj.merchantproviderconfigurations) {
      this.merchantProviderConfigurations = obj.merchantproviderconfigurations.map(c => new MerchantProviderConfiguration(c));
    }

  }

  copy(): LoadBalancer {
    return new LoadBalancer(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      merchantproviderconfigurations: this.merchantProviderConfigurations.map(c => c.inverse())
    }
  }
}
