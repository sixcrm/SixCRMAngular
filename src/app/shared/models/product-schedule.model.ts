import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {MerchantProviderGroup} from './merchant-provider-group.model';
import {Moment, utc} from 'moment';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  quantity: number;
  schedules: Schedule[] = [];
  merchantProviderGroup: MerchantProviderGroup;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any, additional?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.quantity = additional && additional.quantity ? additional.quantity : 1;
    this.merchantProviderGroup = new MerchantProviderGroup(obj.merchantprovidergroup);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.schedule) {
      this.schedules = obj.schedule.map(s => new Schedule(s, obj.days));
    }
  }

  copy(days?: number): ProductSchedule {
    const obj = this.inverse();

    if (days) {
      obj['days'] = days;
    }

    return new ProductSchedule(obj);
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
