import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';

export class Notification implements Entity<Notification> {
  id: string;
  user: string;
  account: string;
  type: string;
  action: string;
  title: string;
  body: string;
  readAt: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.user = obj.user || '';
    this.account = obj.account || '';
    this.type = obj.type || '';
    this.action = obj.action || '';
    this.title = obj.title || '';
    this.body = obj.body || '';
    this.readAt = obj.read_at || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
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
      action: this.action,
      title: this.title,
      body: this.body,
      readAt: this.readAt,
      createdAt: this.createdAt.format(),
      updatedAt: this.updatedAt.format()
    }
  }

  getIconName(): string {
    switch (this.type) {
      case 'acl':
        return 'usericon_action.svg';
      case 'invitation_sent':
        return 'newuser_icon.svg';
      default:
        return 'alert-icon.svg';
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
