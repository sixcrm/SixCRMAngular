import {AccessKey} from './access-key.model';
import {Entity} from './entity.interface';
import {Address} from './address.model';
import {Acl} from './acl.model';

export class User implements Entity<User> {
  id: string;
  name: string;
  auth0Id: string;
  email: string;
  active: string;
  termsAndConditions: string;
  picture: string;
  address: Address;
  accessKey: AccessKey;
  acls: Acl[];

  constructor(obj?: any) {
    if(!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.auth0Id = obj.auth0_id || '';
    this.email = obj.email || '';
    this.active = obj.active || '';
    this.termsAndConditions = obj.termsandconditions || '';
    this.address = new Address(obj.address);
    this.accessKey = new AccessKey(obj.accesskey);

    this.acls = [];
    if (obj.acl) {
      for (let i = 0; i < obj.acl.length; i++) {
        this.acls.push(new Acl(obj.acl[i]));
      }
    }
  }

  copy(): User {
    return new User(this.inverse());
  }

  inverse(): any {
    let acls = [];
    for (let index in this.acls) {
      acls.push(this.acls[index].inverse());
    }

    return {
      id: this.id,
      name: this.name,
      auth0_id: this.auth0Id,
      email: this.email,
      active: this.active,
      termsandconditions: this.termsAndConditions,
      address: this.address.inverse(),
      acl: acls
    }
  }
}
