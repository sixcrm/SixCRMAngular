import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  schedules: Schedule[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.schedules = [];

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
      schedule: this.schedules.map(s => s.inverse())
    }
  }
}
