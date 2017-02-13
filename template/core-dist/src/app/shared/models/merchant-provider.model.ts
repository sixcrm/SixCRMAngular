import {Entity} from './entity.interface';

export class MerchantProvider implements Entity<MerchantProvider>{
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

  copy(): MerchantProvider {
    return new MerchantProvider(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      password: this.password,
      endpoint: this.endpoint,
      processor: this.processor
    }
  }
}
