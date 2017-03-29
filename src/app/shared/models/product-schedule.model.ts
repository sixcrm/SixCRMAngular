import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  schedules: Schedule[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.schedules = [];

    if (obj.schedule) {
      for (let i = 0; i < obj.schedule.length; i++) {
        this.schedules.push(new Schedule(obj.schedule[i]));
      }
    }
  }

  copy(): ProductSchedule {
    return new ProductSchedule(this.inverse());
  }

  inverse(): any {
    let schedules = [];
    for (let index in this.schedules) {
      schedules.push(this.schedules[index].inverse());
    }

    return {
      id: this.id,
      schedule: schedules
    }
  }
}
