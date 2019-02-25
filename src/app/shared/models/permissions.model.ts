import {firstIndexOf} from '../utils/array.utils';
export class ParsedPermission {

  constructor(public action?: string, public permissions?: string) {}

  copy() {
    return new ParsedPermission(this.action, this.permissions)
  }
}

export class Permissions {

  id: string;
  allow: string[];
  deny: string[];
  parsedAllowed: ParsedPermission[] = [];
  parsedDenied: ParsedPermission[] = [];


  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.allow = obj.allow || [];
    this.deny = obj.deny || [];

    this.parsedAllowed = this.parseAllowed();
    this.parsedDenied = this.parseDenied();
  }

  parseAllowed(): ParsedPermission[] {
    return this.parseFilter(this.allow)
  }

  parseDenied(): ParsedPermission[] {
    return this.parseFilter(this.deny);
  }

  parseFilter(array: string[]) {
    if (array.length === 1 && array[0] === '*') return [new ParsedPermission('*', getAllPermissionActions().join(' '))];

    const temp: ParsedPermission[] = array.filter(a => a.split('/').length > 1).map(a => {
      const action = a.split('/')[0];
      let permission = a.split('/')[1];

      if (permission === '*') {
        permission = getAllPermissionActions().join(' ');
      }

      return new ParsedPermission(action, permission);
    });

    const res: ParsedPermission[] = [];

    temp.forEach(p => {
      const index = firstIndexOf(res, (el) => el.action === p.action);

      if (index === -1) {
        res.push(p);
      } else {
        res[index].permissions += ` ${p.permissions}`;
      }
    });

    return res;
  }

  hasPermission(entity: string, operation: string): boolean {
    return this.allow.filter(a =>
      a === '*' || a === '*/*' || a === `${entity}/${operation}` || a === `*/${operation}` || a === `${entity}/*`
    ).length > 0;
  }

  inverse(): any {
    return {
      id: this.id,
      allow: this.allow.slice(),
      deny: this.deny.slice()
    }
  }
}

export function getAllPermissionEntities() {
  return [
    '*',
    'analytics',
    'accesskey',
    'affiliate',
    'account',
    'bill',
    'campaign',
    'creditcard',
    'customer',
    'customernote',
    'emailtemplate',
    'merchantprovidergroup',
    'merchantprovidergroupassociation',
    'merchantprovider',
    'productschedule',
    'product',
    'rebill',
    'role',
    'session',
    'shippingreceipt',
    'smtpprovider',
    'smsprovider',
    'transaction',
    'notification',
    'notificationread',
    'notificationsetting',
    'user',
    'useracl',
    'usersetting',
    'usersigningstring',
    'userdevicetoken',
    'tracker',
    'register',
    'fulfillmentprovider'
  ]
}

export function getRestrictedPermissionEntities() {
  return [
    'analytics',
    'accesskey',
    'affiliate',
    'account',
    'bill',
    'campaign',
    'creditcard',
    'customer',
    'customernote',
    'emailtemplate',
    'merchantprovidergroup',
    'merchantprovidergroupassociation',
    'merchantprovider',
    'productschedule',
    'product',
    'rebill',
    'role',
    'session',
    'shippingreceipt',
    'smtpprovider',
    'smsprovider',
    'transaction',
    'notification',
    'notificationread',
    'notificationsetting',
    'user',
    'useracl',
    'usersetting',
    'usersigningstring',
    'userdevicetoken',
    'tracker',
    'register',
    'fulfillmentprovider'
  ]
}

export function getAllPermissionActions() {
  return [
    'read',
    'update',
    'create',
    'delete'
  ]
}
