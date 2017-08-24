import {Entity} from './entity.interface';

export class FulfillmentProvider implements Entity<FulfillmentProvider> {
  id: string;
  name: string;
  provider: string;
  username: string;
  password: string;
  endpoint: string;
  threePLKey: string;
  facilityId: string;
  threePLId: string;
  customerId: string;
  returnAddress: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.provider = obj.provider || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.endpoint = obj.endpoint || '';
    this.threePLKey = obj.threepl_kye || '';
    this.facilityId = obj.facility_id || '';
    this.threePLId = obj.threepl_id || '';
    this.returnAddress = obj.return_address || '';
    this.customerId = obj.customer_ic || '';
  }

  copy(): FulfillmentProvider {
    return new FulfillmentProvider(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      provider: this.provider,
      username: this.username,
      password: this.password,
      endpoint: this.endpoint
    }
  }
}
