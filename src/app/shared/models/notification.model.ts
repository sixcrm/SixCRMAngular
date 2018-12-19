import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';
import {jsonObject} from '../utils/queries/entities/entities-helper.queries';

export class Notification implements Entity<Notification> {
  id: string;
  user: string;
  account: string;
  type: string;
  category: string;
  name: string;
  context: any;
  readAt: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  body: string;
  title: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.user = obj.user || '';
    this.account = obj.account || '';
    this.type = obj.type || '';
    this.category = obj.category || '';
    this.name = obj.name || '';
    this.context = this.parseContext(obj.context) || {};
    this.readAt = obj.read_at || '';
    this.createdAt = utc(obj.created_at).local();
    this.updatedAt = utc(obj.updated_at).local();
    this.updatedAtAPI = obj.updated_at;
  }

  parseContext(obj?: any): any {
    return JSON.parse(JSON.stringify(obj).replace(new RegExp('__', 'g'), '.'));
  }

  copy(): Notification {
    return new Notification(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      user: this.user,
      account: this.account,
      type: this.type,
      category: this.category,
      name: this.name,
      context: this.context,
      readAt: this.readAt,
      createdAt: this.createdAt.format(),
      updatedAt: this.updatedAtAPI
    }
  }

  markAsRead() {
    this.readAt = utc().format();

    return this;
  }

  markAsUnread() {
    this.readAt = null;

    return this;
  }

  hasContext(): boolean {
    return Object.keys(this.context).length > 0;
  }

  contextLink(): string {
    if (this.name === 'user_invited') {
      return '/accountmanagement/users';
    }

    let identifiableEntityId;
    let identifiableEntityName;

    for (let key in this.context) {
      if (key.includes('.id')) {
        identifiableEntityId = this.context[key];
        identifiableEntityName = key.replace('.id', '');

        break;
      }
    }

    if (['customer', 'rebill', 'session'].indexOf(identifiableEntityName) !== -1){
      return '/customers/advanced'
    }

    return `/${identifiableEntityName}s/${identifiableEntityId}`;
  }

  contextQueryParams(): any {
    let identifiableEntityId;
    let identifiableEntityName;

    for (let key in this.context) {
      if (key.includes('.id')) {
        identifiableEntityId = this.context[key];
        identifiableEntityName = key.replace('.id', '');

        break;
      }
    }

    switch (identifiableEntityName) {
      case 'customer': {
        return {customer: identifiableEntityId}
      }
      case 'session': {
        return {session: identifiableEntityId}
      }

      case 'rebill': {
        return {order: identifiableEntityId}
      }
      default: {
        return {}
      }
    }
  }
}

export function compareNotifications(f: Notification, s: Notification): number {
  if (f.createdAt.isBefore(s.createdAt)) {
    return 1;
  }

  if (f.createdAt.isAfter(s.createdAt)) {
    return -1;
  }

  return 0;
}
