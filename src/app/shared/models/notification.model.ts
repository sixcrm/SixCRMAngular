import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';

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
    this.context = obj.context || {};
    this.readAt = obj.read_at || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
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

  getIconName(): string {
    if (this.type === 'alert') {
      return 'alert-notification-icon.svg';
    }

    switch (this.category) {
      case 'acl':
      case 'invitation_sent':
        return 'newuser_icon.svg';
      case 'merchant':
      case 'payment':
        return 'merchant_icon.svg';
      case 'fulfillment':
        return 'fulfillment_icon.svg';
      default:
        return 'usericon_action.svg';
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
