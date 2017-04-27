import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class Affiliate implements Entity<Affiliate> {
  id: string;
  affiliateId: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.affiliateId = obj.affiliate_id || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): Affiliate {
    return new Affiliate({
      id: this.id,
      affiliate_id: this.affiliateId,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    });
  }
}
