import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {User} from './user.model';
import {Account} from './account.model';
import {getAllPermissionActions} from './permissions.model';
import {firstIndexOf} from '../utils/array.utils';

export class EntityAclPermissionParsed {

  constructor(public user?: User, public account?: Account, public action?: string) {};

  copy(): EntityAclPermissionParsed {
    return new EntityAclPermissionParsed(this.user, this.account, this.action);
  }
}

export class EntityAcl implements Entity<EntityAcl> {

  id: string;
  entity: string;
  type: string;
  allow: string[];
  allowParsed: EntityAclPermissionParsed[];
  deny: string[];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.entity || '';
    this.entity = obj.entity || '';
    this.type = obj.type || '';
    this.allow = obj.allow || [];
    this.allowParsed = this.parseAllowed(this.allow);
    this.deny = obj.deny || [];
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): EntityAcl {
    return new EntityAcl(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      entity: this.entity,
      type: this.type,
      allow: this.allow.slice(),
      deny: this.deny.slice(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }

  parseAllowed(allowed: string[]): EntityAclPermissionParsed[] {
    const temp = allowed.map(allow => {
      let user = '*';
      let acc = '*';
      let permissions = getAllPermissionActions().join(' ');

      if (allow !== '*') {
        const splitted = allow.split('/');

        user = splitted[0];
        acc = splitted[1];

        if (splitted[2] !== '*') {
          permissions = splitted[2];
        }
      }

      return new EntityAclPermissionParsed(new User({name: user, id: user}), new Account({name: acc, id: acc}), permissions)
    });

    const result: EntityAclPermissionParsed[] = [];

    temp.forEach(permission => {
      const index = firstIndexOf(result, (el) => el.user.id === permission.user.id && el.account.id === permission.account.id);

      if (index === -1) {
        result.push(permission);
      } else {
        result[index].action += ` ${permission.action}`
      }
    });

    return result;
  }
}
