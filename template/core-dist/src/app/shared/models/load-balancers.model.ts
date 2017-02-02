import {MerchantProviderConfiguration} from './merchant-provider-configuration.model';

export class LoadBalancers {
  id: string;
  merchantProviderConfigurations: MerchantProviderConfiguration[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.merchantProviderConfigurations = [];
    if (obj.merchantproviderconfigurations) {
      for (let i = 0; i < obj.merchantproviderconfigurations.length; i++) {
        this.merchantProviderConfigurations.push(new MerchantProviderConfiguration(obj.merchantproviderconfigurations[i]))
      }
    }

  }
}
