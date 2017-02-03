export class MerchantProvider {
  id: string;
  name: string;
  username: string;
  password: string;
  endpoint: string;
  processor: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.endpoint = obj.endpoint || '';
    this.processor = obj.processor || '';
  }
}
