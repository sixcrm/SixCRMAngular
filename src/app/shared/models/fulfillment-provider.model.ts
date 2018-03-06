import {Entity} from './entity.interface';
import {FulfillmentproviderData} from "./fulfillment-provider-data.model";
import {Moment, utc} from 'moment';

export class FulfillmentProvider implements Entity<FulfillmentProvider> {
  id: string;
  name: string;
  provider: FulfillmentproviderData;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.provider = new FulfillmentproviderData(obj.provider);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): FulfillmentProvider {
    return new FulfillmentProvider(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      provider: this.provider.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
