import {Customer} from './customer.model';
import {ProductSchedule} from './product-schedule.model';
import {Rebill} from './rebill.model';
import {Campaign} from './campaign.model';

export class Session {
  id: string;
  customer: Customer;
  productSchedules: ProductSchedule[] = [];
  rebills: Rebill[] = [];
  campaign: Campaign;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
    this.campaign = new Campaign(obj.campaign);

    if (obj.product_schedules) {
      for (let i = 0; i < obj.product_schedules.length; i++) {
        this.productSchedules.push(new ProductSchedule(obj.product_schedules[i]))
      }
    }

    if (obj.rebills) {
      for (let i = 0; i < obj.rebills.length; i++) {
        this.rebills.push(new Rebill(obj.rebills[i]))
      }
    }
  }
}
