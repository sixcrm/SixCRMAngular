import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {generateUUID} from '../utils/queries/entities/entities-helper.queries';

export class Affiliate implements Entity<Affiliate> {
  id: string;
  name: string;
  affiliateId: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.affiliateId = obj.affiliate_id || btoa(generateUUID()).substring(0, 10).toUpperCase();
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  copy(): Affiliate {
    return new Affiliate(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      affiliate_id: this.affiliateId,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
