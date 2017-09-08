import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {LoadBalancer} from './load-balancer.model';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  schedules: Schedule[] = [];
  loadBalancer: LoadBalancer;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.loadBalancer = new LoadBalancer(obj.loadbalancer);

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
      loadbalancer: this.loadBalancer.inverse(),
      schedule: this.schedules.map(s => s.inverse())
    }
  }
}
