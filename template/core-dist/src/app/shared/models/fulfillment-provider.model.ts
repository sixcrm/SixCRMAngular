export class FulfillmentProvider {
  id: string;
  name: string;
  provider: string;
  username: string;
  password: string;
  endpoint: string;

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
  }

  copy(): FulfillmentProvider {
    return new FulfillmentProvider({
      id: this.id,
      name: this.name,
      provider: this.provider,
      username: this.username,
      password: this.password,
      endpoint: this.endpoint
    })
  }
}
