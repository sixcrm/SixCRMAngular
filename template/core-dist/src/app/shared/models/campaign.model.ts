import {ProductSchedule} from './product-schedule.model';

export class Campaign {
  id: string;
  name: string;
  productSchedules: ProductSchedule[];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.name = obj.name;
    this.productSchedules = [];

    if (obj.productschedules) {
      for (let i = 0; i < obj.productschedules; i++) {
        this.productSchedules.push(new ProductSchedule(obj[i]));
      }
    }
  }
}
