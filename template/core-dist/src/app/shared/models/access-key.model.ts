export class AccessKey {
  id: string;
  accessKey: string;
  secretKey: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.accessKey = obj.access_key;
    this.secretKey = obj.secret_key;
  }
}
