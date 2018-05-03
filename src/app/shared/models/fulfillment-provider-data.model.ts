export class FulfillmentproviderData {
  name: string;
  username: string;
  password: string;
  threeplKey: string;
  threeplCustomerId: number;
  threeplId: number;
  threeplFacilityId: number;
  apiKey: string;
  apiSecret: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.threeplKey = obj.threepl_key || '';
    this.threeplCustomerId = obj.threepl_customer_id;
    this.threeplId = obj.threepl_id;
    this.threeplFacilityId = obj.threepl_facility_id;
    this.apiKey = obj.api_key || '';
    this.apiSecret = obj.api_secret || '';
  }

  copy(): FulfillmentproviderData {
    return new FulfillmentproviderData(this.inverse());
  }

  inverse(): any {
    return {
      name: this.name,
      username: this.username,
      password: this.password,
      threepl_key: this.threeplKey,
      threepl_customer_id: this.threeplCustomerId,
      threepl_id: this.threeplId,
      threepl_facility_id: this.threeplFacilityId,
      api_key: this.apiKey,
      api_secret: this.apiSecret
    }
  }
}
