import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class Tag implements Entity<Tag> {

  id: string;
  entity: string;
  key: string;
  value: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.entity = obj.entity || '';
    this.key = obj.key || '';
    this.value = obj.value || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): Tag {
    return new Tag(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      entity: this.entity,
      key: this.key,
      value: this.value,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
