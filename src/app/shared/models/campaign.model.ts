import {ProductSchedule} from './product-schedule.model';
import {LoadBalancer} from './load-balancers.model';
import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';

export class Campaign implements Entity<Campaign>{
  id: string;
  name: string;
  productSchedules: ProductSchedule[];
  loadBalancer: LoadBalancer;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.name = obj.name;
    this.productSchedules = [];
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    if (obj.productschedules) {
      for (let i = 0; i < obj.productschedules.length; i++) {
        this.productSchedules.push(new ProductSchedule(obj.productschedules[i]));
      }
    }

    this.loadBalancer = new LoadBalancer(obj.loadbalancer);
  }

  copy(): Campaign {
    return null;
  }
}
