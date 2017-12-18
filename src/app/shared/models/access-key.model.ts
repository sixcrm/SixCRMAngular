import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {TextMaskPipe} from '../pipes/text-mask.pipe';

export class AccessKey implements Entity<AccessKey> {
  id: string;
  name: string;
  notes: string;
  accessKey: string;
  secretKey: string;
  secretKeyMasked: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.accessKey = obj.access_key || '';
    this.secretKey = obj.secret_key || '';
    this.secretKeyMasked = new TextMaskPipe().transform(this.secretKey, true, 4);
    this.notes = obj.notes || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): AccessKey {
    return new AccessKey(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes,
      secret_key: this.secretKey,
      access_key: this.accessKey,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
