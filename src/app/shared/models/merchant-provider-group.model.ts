import {MerchantProviderConfiguration} from './merchant-provider-configuration.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class MerchantProviderGroup implements Entity<MerchantProviderGroup> {
  id: string;
  name: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  merchantProviderConfigurations: MerchantProviderConfiguration[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.merchantproviderconfigurations) {
      this.merchantProviderConfigurations = obj.merchantproviderconfigurations.map(c => new MerchantProviderConfiguration(c));
    }

  }

  copy(): MerchantProviderGroup {
    return new MerchantProviderGroup(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI,
      merchantproviderconfigurations: this.merchantProviderConfigurations.map(c => c.inverse())
    }
  }
}
