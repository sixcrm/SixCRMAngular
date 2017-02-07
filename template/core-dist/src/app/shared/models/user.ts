import {AccessKey} from './access-key.model';

export class User {
  id: string;
  name: string;
  auth0Id: string;
  email: string;
  active: string;
  accessKey: AccessKey;

  constructor(obj?: any) {
    if(!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.auth0Id = obj.auth0_id || '';
    this.email = obj.email || '';
    this.active = obj.active || '';
    this.accessKey = new AccessKey(obj.accesskey);
  }
}
