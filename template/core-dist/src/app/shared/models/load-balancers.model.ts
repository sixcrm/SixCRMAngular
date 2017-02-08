import {MerchantProviderConfiguration} from './merchant-provider-configuration.model';

export class LoadBalancer {
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

  copy(): LoadBalancer {
    return new LoadBalancer(this.inverse());
  }

  inverse(): any {
    let configs = [];
    for (let index in this.merchantProviderConfigurations) {
      configs.push(this.merchantProviderConfigurations[index].inverse());
    }

    return {
      id: this.id,
      merchantproviderconfigurations: configs
    }
  }
}
