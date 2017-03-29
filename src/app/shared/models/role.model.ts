import {Permissions} from './permissions.model';
import {Entity} from './entity.interface';

export class Role implements Entity<Role> {

  id: string;
  name: string;
  active: string;
  permissions: Permissions;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active || '';
    this.permissions = new Permissions(obj.permissions);
  }

  hasPermission(entity: string, operation: string): boolean {
    // Owner has all permissions
    if (this.name === 'Owner' && this.permissions.allow[0] && this.permissions.allow[0] === '*') {
      return true;
    }

    return this.permissions.hasPermission(entity, operation);
  }

  copy(): Role {
    return new Role(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      active: this.active,
      permissions: this.permissions.inverse()
    }
  }
}
