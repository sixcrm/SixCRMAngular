import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';

export class ActionParsed {
  entity: string;
  id: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.entity = obj.entity || '';
    this.id = obj.id || '';
  }
}

export class Notification implements Entity<Notification> {
  id: string;
  user: string;
  account: string;
  type: string;
  category: string;
  action: string;
  actionParsed: ActionParsed;
  title: string;
  body: string;
  readAt: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.user = obj.user || '';
    this.account = obj.account || '';
    this.type = obj.type || '';
    this.category = obj.category || '';
    this.action = obj.action || '';

    try {
      this.actionParsed = new ActionParsed(JSON.parse(this.action));
    } catch (e) {
      this.actionParsed = new ActionParsed();
    }

    this.title = obj.title || '';
    this.body = obj.body || '';
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
      action: this.action,
      title: this.title,
      body: this.body,
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

  getActionText(): string {
    return `action: ${this.action}`;
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
