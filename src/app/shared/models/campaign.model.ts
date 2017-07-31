import {ProductSchedule} from './product-schedule.model';
import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';
import {EmailTemplate} from './email-template.model';

export class Campaign implements Entity<Campaign>{
  id: string;
  name: string;
  allowPrepaid: boolean;
  showPrepaid: boolean;
  productSchedules: ProductSchedule[] = [];
  emailTemplates: EmailTemplate[] = [];
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id;
    this.name = obj.name;
    this.allowPrepaid = obj.allow_prepaid || false;
    this.showPrepaid = obj.show_prepaid || false;
    this.productSchedules = [];
    this.emailTemplates = [];
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    if (obj.productschedules) {
      this.productSchedules = obj.productschedules.map(p => new ProductSchedule(p));
    }

    if (obj.emailtemplates) {
      this.emailTemplates = obj.emailtemplates.map(e => new EmailTemplate(e));
    }
  }

  copy(): Campaign {
    return new Campaign(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      allow_prepaid: this.allowPrepaid,
      show_prepaid: this.showPrepaid,
      productschedules: this.productSchedules.map(p => p.inverse()),
      emailtemplates: this.emailTemplates.map(e => e.inverse()),
      created_at: this.createdAt.clone().format(),
      updated_at: this.createdAt.clone().format()
    }
  }
}
