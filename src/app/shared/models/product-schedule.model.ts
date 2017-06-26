import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {LoadBalancer} from './load-balancer.model';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  schedules: Schedule[] = [];
  loadBalancers: LoadBalancer[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';

    if (obj.loadbalancers) {
      this.loadBalancers = obj.loadbalancers.map(l => new LoadBalancer());
    }

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
      loadbalancers: this.loadBalancers.map(l => l.inverse()),
      schedule: this.schedules.map(s => s.inverse())
    }
  }
}
