import {AccessKey} from './access-key.model';
import {Entity} from './entity.interface';
import {Address} from './address.model';
import {Acl} from './acl.model';
import {Moment, utc} from 'moment';

export class User implements Entity<User> {
  id: string;
  name: string;
  alias: string;
  firstName: string;
  lastName: string;
  auth0Id: string;
  email: string;
  company: string;
  active: boolean;
  termsAndConditions: string;
  termsAndConditionsOutdated: boolean;
  picture: string;
  address: Address;
  accessKey: AccessKey;
  acls: Acl[];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if(!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.alias = obj.alias || '';
    this.firstName = obj.first_name || '';
    this.lastName = obj.last_name || '';
    this.auth0Id = obj.auth0_id || '';
    this.email = obj.id || '';
    this.company = obj.company || '';
    this.active = obj.active;
    this.termsAndConditions = obj.termsandconditions || '';
    this.termsAndConditionsOutdated = obj.termsandconditions_outdated;
    this.picture = obj.picture || '';
    this.address = new Address(obj.address);
    this.accessKey = new AccessKey(obj.accesskey);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

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

  toggleActive(): void {
    this.active = !this.active;
  }

  inverse(): any {
    let acls = [];
    for (let index in this.acls) {
      acls.push(this.acls[index].inverse());
    }

    return {
      id: this.id,
      name: this.name,
      alias: this.alias,
      first_name: this.firstName,
      last_name: this.lastName,
      auth0_id: this.auth0Id,
      email: this.email,
      company: this.company,
      active: this.active,
      termsandconditions: this.termsAndConditions,
      termsandconditions_outdated: this.termsAndConditionsOutdated,
      address: this.address.inverse(),
      picture: this.picture,
      acl: acls,
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI
    }
  }

  hasPermissions(entity: string, operation: string, currentAcl?: Acl): boolean {
    if (!currentAcl) {
      currentAcl = new Acl();
    }

    return currentAcl.role.hasPermission(entity, operation);
  }

  getAclWithId(id: string): Acl {
    if (!id || !this.acls || this.acls.length === 0) {
      return null;
    }

    const filtered = this.acls.filter(acl => acl.id === id);

    if (filtered && filtered[0]) {
      return filtered[0];
    }

    return null;
  }

  getDefaultImage() {
    return null;
  }
}
