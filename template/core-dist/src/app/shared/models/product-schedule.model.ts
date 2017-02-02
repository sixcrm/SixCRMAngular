import {Schedule} from './schedule.model';

export class ProductSchedule {
  id: string;
  schedule: Schedule[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.schedule = [];

    if (obj.schedule) {
      for (let i = 0; i < obj.schedule.length; i++) {
        this.schedule.push(new Schedule(obj[i]));
      }
    }
  }
}
