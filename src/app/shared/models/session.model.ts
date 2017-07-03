import {Customer} from './customer.model';
import {ProductSchedule} from './product-schedule.model';
import {Rebill} from './rebill.model';
import {Campaign} from './campaign.model';
import {Entity} from './entity.interface';
import {Affiliate} from './affiliate.model';
import {utc, Moment} from 'moment';

export class Session implements Entity<Session> {
  id: string;
  customer: Customer;
  productSchedules: ProductSchedule[] = [];
  rebills: Rebill[] = [];
  campaign: Campaign;
  affiliate: Affiliate;
  subAffiliate1: Affiliate;
  subAffiliate2: Affiliate;
  subAffiliate3: Affiliate;
  subAffiliate4: Affiliate;
  subAffiliate5: Affiliate;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.customer = new Customer(obj.customer);
    this.campaign = new Campaign(obj.campaign);
    this.affiliate = new Affiliate(obj.affiliate);
    this.subAffiliate1 = new Affiliate(obj.subaffiliate_1);
    this.subAffiliate2 = new Affiliate(obj.subaffiliate_2);
    this.subAffiliate3 = new Affiliate(obj.subaffiliate_3);
    this.subAffiliate4 = new Affiliate(obj.subaffiliate_4);
    this.subAffiliate5 = new Affiliate(obj.subaffiliate_5);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

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

  parseAffiliates(): Affiliate[] {
    let affiliates = [
      this.affiliate,
      this.subAffiliate1,
      this.subAffiliate2,
      this.subAffiliate3,
      this.subAffiliate4,
      this.subAffiliate5
    ];

    return affiliates.filter(a => a.id);
  }

  copy(): Session {
    return new Session(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      customer: this.customer.inverse(),
      product_schedules: this.productSchedules.map(p => p.inverse()),
      rebills: this.rebills.map(r => r.inverse()),
      campaign: this.campaign.inverse(),
      affiliate: this.affiliate.inverse(),
      subaffiliate_1: this.subAffiliate1.inverse(),
      subaffiliate_2: this.subAffiliate2.inverse(),
      subaffiliate_3: this.subAffiliate3.inverse(),
      subaffiliate_4: this.subAffiliate4.inverse(),
      subaffiliate_5: this.subAffiliate5.inverse(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAt.clone().format()
    }
  }
}
