import {Schedule} from './schedule.model';

export class ProductSchedule {
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
}
