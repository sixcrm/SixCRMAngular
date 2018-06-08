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
    return this.id === 'cae614de-ce8a-40b9-8137-3d3bdff78039';
  }

  isDisabled(): boolean {
    return this.name === '78e507dd-93fc-413b-b21a-819480209740';
  }

  isAdmin(): boolean {
    return this.name === 'e09ac44b-6cde-4572-8162-609f6f0aeca8';
  }

  isNoPermissions(): boolean {
    return this.name === '6341d12d-4c36-4717-bf6d-1d0cbebe63d8';
  }

  isCustomerService(): boolean {
    return this.name === '1116c054-42bb-4bf5-841e-ee0c413fa69e';
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
