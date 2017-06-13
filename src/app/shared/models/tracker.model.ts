import {Entity} from './entity.interface';
import {Affiliate} from './affiliate.model';
import {utc, Moment} from 'moment';

export class Tracker implements Entity<Tracker> {
  id: string;
  affiliate: Affiliate;
  eventType: string[] = [];
  type: string;
  body: string;
  createdAt: Moment;
  updateAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.affiliate = new Affiliate(obj.affiliate);
    this.type = obj.type || '';
    this.body = obj.body || '';
    this.createdAt = utc(obj.created_at);
    this.updateAt = utc(obj.updated_at);

    if (obj.event_type) {
      Object.keys(obj.event_type).forEach(key => this.eventType.push(obj.event_type[key]));
    }
  }

  copy(): Tracker {
    return null;
  }
}
