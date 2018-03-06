import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {MerchantProviderGroup} from './merchant-provider-group.model';
import {Moment, utc} from 'moment';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  schedules: Schedule[] = [];
  merchantProviderGroup: MerchantProviderGroup;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.merchantProviderGroup = new MerchantProviderGroup(obj.merchantprovidergroup);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.schedule) {
      this.schedules = obj.schedule.map(s => new Schedule(s));
    }
  }

  copy(): ProductSchedule {
    return new ProductSchedule(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedules.map(s => s.inverse()),
      updated_at: this.updatedAtAPI,
      created_at: this.createdAt.format(),
      merchantprovidergroup: this.merchantProviderGroup.inverse(),
    }
  }
}
