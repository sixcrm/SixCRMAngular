import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {MerchantProviderGroup} from './merchant-provider-group.model';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  schedules: Schedule[] = [];
  merchantProviderGroup: MerchantProviderGroup;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.merchantProviderGroup = new MerchantProviderGroup(obj.merchantprovidergroup);

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
      merchantprovidergroup: this.merchantProviderGroup.inverse(),
      schedule: this.schedules.map(s => s.inverse())
    }
  }
}
