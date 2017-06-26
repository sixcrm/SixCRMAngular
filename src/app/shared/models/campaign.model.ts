import {ProductSchedule} from './product-schedule.model';
import {LoadBalancer} from './load-balancer.model';
import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';
import {EmailTemplate} from './email-template.model';

export class Campaign implements Entity<Campaign>{
  id: string;
  name: string;
  productSchedules: ProductSchedule[] = [];
  emailTemplates: EmailTemplate[] = [];
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
      this.productSchedules = obj.productschedules.map(p => new ProductSchedule(p));
    }

    if (obj.emailtemplates) {
      this.emailTemplates = obj.emailtemplates.map(e => new EmailTemplate(e));
    }

    this.loadBalancer = new LoadBalancer(obj.loadbalancer);
  }

  copy(): Campaign {
    return new Campaign(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      productschedules: this.productSchedules.map(p => p.inverse()),
      emailtemplates: this.emailTemplates.map(e => e.inverse()),
      loadbalancer: this.loadBalancer.inverse(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.createdAt.clone().format()
    }
  }
}
