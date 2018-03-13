import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class EventHook implements Entity<EventHook> {
  id: string;
  name: string;
  hook: string;
  hookDecoded: string;
  active: boolean;
  eventType: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.active = obj.active;
    this.hook = obj.hook || '';
    this.hookDecoded = atob(this.hook);
    this.eventType = obj.event_type && obj.event_type.length > 0 ? obj.event_type[0] : '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  encodeHook() {
    return btoa(this.hookDecoded);
  }

  copy(): EventHook {
    return new EventHook(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      hook: this.hook,
      active: this.active,
      event_type: this.eventType ? [this.eventType] : [],
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
    }
  }
}
