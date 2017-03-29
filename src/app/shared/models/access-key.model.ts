import {Entity} from './entity.interface';

export class AccessKey implements Entity<AccessKey> {
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

  copy(): AccessKey {
    return null;
  }
}
