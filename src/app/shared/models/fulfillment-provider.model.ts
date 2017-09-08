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
    this.threePLKey = obj.threepl_key || '';
    this.facilityId = obj.facility_id || '';
    this.threePLId = obj.threepl_id || '';
    this.returnAddress = obj.return_address || '';
    this.customerId = obj.customer_id || '';
  }

  copy(): FulfillmentProvider {
    return new FulfillmentProvider(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      threepl_key: this.threePLKey,
      threepl_id: this.threePLId,
      facility_id: this.facilityId,
      return_address: this.returnAddress,
      customer_id: this.customerId,
      provider: this.provider,
      username: this.username,
      password: this.password,
      endpoint: this.endpoint
    }
  }
}
