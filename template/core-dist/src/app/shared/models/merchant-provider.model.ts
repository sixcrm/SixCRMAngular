export class MerchantProvider {
  id: string;
  username: string;
  password: string;
  endpoint: string;
  processor: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.endpoint = obj.endpoint || '';
    this.processor = obj.processor || '';
  }
}
