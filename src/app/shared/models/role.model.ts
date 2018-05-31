import {Permissions} from './permissions.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class Role implements Entity<Role> {

  id: string;
  name: string;
  active: string;
  permissions: Permissions;
  createdAt: Moment;
  updatedAt: Moment;
  isShared: boolean;
  description: string;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active || '';
    this.isShared = obj.is_shared || false;
    this.permissions = new Permissions(obj.permissions);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  hasPermission(entity: string, operation: string): boolean {
    // Owner has all permissions
    if (this.name === 'Owner' && this.permissions.allow[0] && this.permissions.allow[0] === '*') {
      return true;
    }

    return this.permissions.hasPermission(entity, operation);
  }

  isOwnerOrAdministrator(): boolean {
    return this.hasPermission('bill', 'create');
  }

  isOwner(): boolean {
    return this.name === 'Owner';
  }

  isDisabled(): boolean {
    return this.name === 'Disabled';
  }

  isAdmin(): boolean {
    return this.name === 'Administrator';
  }

  isNoPermissions(): boolean {
    return this.name === 'No Permissions';
  }

  isCustomerService(): boolean {
    return this.name === 'Customer Service';
  }

  copy(): Role {
    return new Role(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      is_shared: this.isShared,
      active: this.active,
      permissions: this.permissions.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
