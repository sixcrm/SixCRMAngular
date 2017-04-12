import {Moment, utc} from 'moment';

export class Notification {
  id: string;
  user: string;
  account: string;
  type: string;
  action: string;
  message: string;
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
    this.message = obj.message || '';
    this.readAt = obj.read_at || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }
}
