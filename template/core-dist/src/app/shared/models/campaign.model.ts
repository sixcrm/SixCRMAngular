import {ProductSchedule} from './product-schedule.model';
import {LoadBalancer} from './load-balancers.model';

export class Campaign {
  id: string;
  name: string;
  productSchedules: ProductSchedule[];
  loadBalancer: LoadBalancer;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.name = obj.name;
    this.productSchedules = [];

    if (obj.productschedules) {
      for (let i = 0; i < obj.productschedules.length; i++) {
        this.productSchedules.push(new ProductSchedule(obj.productschedules[i]));
      }
    }

    this.loadBalancer = new LoadBalancer(obj.loadbalancer);
  }
}
