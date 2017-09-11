import {MerchantProviderConfiguration} from './merchant-provider-configuration.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class LoadBalancer implements Entity<LoadBalancer> {
  id: string;
  name: string;
  createdAt: Moment;
  updatedAt: Moment;
  merchantProviderConfigurations: MerchantProviderConfiguration[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

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
      name: this.name,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAt.clone().format(),
      merchantproviderconfigurations: this.merchantProviderConfigurations.map(c => c.inverse())
    }
  }
}
