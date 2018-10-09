import {Customer} from './customer.model';
import {ProductSchedule} from './product-schedule.model';
import {Rebill} from './rebill.model';
import {Campaign} from './campaign.model';
import {Entity} from './entity.interface';
import {Affiliate} from './affiliate.model';
import {utc, Moment} from 'moment';
import {Watermark} from './watermark/watermark.model';
import {SessionCancelation} from './session-cancelation.model';
import {Product} from './product.model';
import {WatermarkProductSchedule} from './watermark/watermark-product-schedule.model';
import {WatermarkProduct} from './watermark/watermark-product.model';

export class Session implements Entity<Session> {
  id: string;
  alias: string;
  customer: Customer;
  productSchedules: ProductSchedule[] = [];
  completed: boolean;
  rebills: Rebill[] = [];
  nextRebill: Rebill;
  campaign: Campaign;
  cid: Affiliate;
  affiliate: Affiliate;
  subAffiliate1: Affiliate;
  subAffiliate2: Affiliate;
  subAffiliate3: Affiliate;
  subAffiliate4: Affiliate;
  subAffiliate5: Affiliate;
  watermark: Watermark;
  cancelled: SessionCancelation;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  startedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.alias = obj.alias || '';
    this.customer = new Customer(obj.customer);
    this.completed = !!obj.completed;
    this.campaign = new Campaign(obj.campaign);
    this.cid = new Affiliate(obj.cid);
    this.affiliate = new Affiliate(obj.affiliate);
    this.subAffiliate1 = new Affiliate(obj.subaffiliate_1);
    this.subAffiliate2 = new Affiliate(obj.subaffiliate_2);
    this.subAffiliate3 = new Affiliate(obj.subaffiliate_3);
    this.subAffiliate4 = new Affiliate(obj.subaffiliate_4);
    this.subAffiliate5 = new Affiliate(obj.subaffiliate_5);
    this.cancelled = new SessionCancelation(obj.cancelled);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.startedAt = utc(obj.created_at).hour(0).minute(0).second(0).millisecond(0);
    this.watermark = new Watermark(obj.watermark, this.createdAt.clone());

    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(ps => new ProductSchedule(ps));
    }

    if (obj.rebills) {
      this.rebills = obj.rebills.map(r => new Rebill(r));
      this.nextRebill = this.getNextRebill();
    }

    this.transformAffiliates();
  }

  transformAffiliates(): void {
    this.affiliate.name = this.affiliate.name || 'Affiliate';
    this.subAffiliate1.name = this.subAffiliate1.name || 'Sub Affiliate 1';
    this.subAffiliate2.name = this.subAffiliate2.name || 'Sub Affiliate 2';
    this.subAffiliate3.name = this.subAffiliate3.name || 'Sub Affiliate 3';
    this.subAffiliate4.name = this.subAffiliate4.name || 'Sub Affiliate 4';
    this.subAffiliate5.name = this.subAffiliate5.name || 'Sub Affiliate 5';
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

  getNextRebill(): Rebill {
    if (!this.rebills || this.rebills.length === 0) return null;

    const now = utc();
    let next: Rebill = null;

    for (let i = 0; i < this.rebills.length; i++) {
      if (this.rebills[i].billAt.isSameOrAfter(next ? next.billAt : now)) {
        next = this.rebills[i];
      }
    }

    return next;
  }

  copy(): Session {
    return new Session(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      alias: this.alias,
      customer: this.customer.inverse(),
      product_schedules: this.productSchedules.map(p => p.inverse()),
      rebills: this.rebills.map(r => r.inverse()),
      campaign: this.campaign && this.campaign.inverse ? this.campaign.inverse() : new Campaign(),
      affiliate: this.affiliate.inverse(),
      completed: this.completed,
      cid: this.cid.inverse(),
      subaffiliate_1: this.subAffiliate1.inverse(),
      subaffiliate_2: this.subAffiliate2.inverse(),
      subaffiliate_3: this.subAffiliate3.inverse(),
      subaffiliate_4: this.subAffiliate4.inverse(),
      subaffiliate_5: this.subAffiliate5.inverse(),
      watermark: this.watermark.inverse(),
      cancelled: this.cancelled.inverse(),
      created_at: this.createdAt.clone().format(),
      updated_at: this.updatedAtAPI
    }
  }

  copyWithWatermark(productSchedules: ProductSchedule[], products: Product[]): Session {
    let copy: Session = this.copy();

    if (productSchedules) {
      copy.watermark.productSchedules = productSchedules.map(ps => new WatermarkProductSchedule({quantity: ps.quantity, product_schedule: ps.inverse()}));
      copy.watermark.extractedProductSchedules = productSchedules;
    }

    if (products) {
      copy.watermark.products = products.map(p => new WatermarkProduct({quantity: p.quantity, price: p.price.amount, product: p.inverse()}));
      copy.watermark.extractedProducts = products;
    }

    return copy;
  }
}
