import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';
import {Currency} from '../utils/currency/currency';
import {EmailTemplate} from './email-template.model';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  quantity: number;
  initialCycleSchedules: Schedule[] = [];
  initialCycleSchedulesPrice: Currency = new Currency(0);
  schedules: Schedule[] = [];
  instantiationDate: Moment;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  emailTemplates: EmailTemplate[] = [];

  start: number;
  end: number;

  constructor(obj?: any, additional?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.quantity = additional && additional.quantity ? additional.quantity : 1;
    this.instantiationDate = additional && additional.instantiationDate ? additional.instantiationDate : null;

    if (obj.emailtemplates) {
      this.emailTemplates = obj.emailtemplates.map(e => new EmailTemplate(e));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.schedule) {
      this.schedules = obj.schedule.map(s => {
        s.instantiationDate = additional ? additional.instantiationDate : null;

        return new Schedule(s, obj.days)
      });

      this.initialCycleSchedules = this.calculateInitialSchedules();
      this.initialCycleSchedulesPrice = new Currency((this.initialCycleSchedules || []).reduce((a,b)=> a + b.price.amount, 0));
      this.start = this.getStart();
      this.end = this.getEnd();
    }
  }

  calculateInitialSchedules(): Schedule[] {
    let start = this.schedules[0] ? this.schedules[0].start : 0;
    let schedules: Schedule[] = [];

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start === 0) {
        start = 0;
        break;
      }

      if (this.schedules[i].start < start) {
        start = this.schedules[i].start;
      }
    }

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start === start) {
        schedules.push(this.schedules[i].copy());
      }
    }

    return schedules;
  }

  getInitialPrice(): Currency {
    return new Currency(this.schedules.filter(s => s.start === 0).map(s => s.price.amount).reduce((a,b)=>a+b,0));
  }

  getDefaultImagePath(): string {
    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start === 0) {
        return this.schedules[i].product.getDefaultImagePath();
      }
    }

    return '/assets/images/product-default-image.svg';
  }

  getStart(): number {
    if (!this.schedules || this.schedules.length === 0) return 0;

    let start = this.schedules[0].start || 0;

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start < start) {
        start = this.schedules[i].start;
      }
    }

    return start;
  }

  getEnd(): number {
    if (!this.schedules || this.schedules.length === 0) return null;

    let end = this.schedules[0].end;

    if (!end) return null;

    for (let i = 0; i < this.schedules.length; i++) {
      if (!this.schedules[i].end) return null;

      if (this.schedules[i].end > end) {
        end = this.schedules[i].end;
      }
    }

    return end;
  }

  copy(days?: number): ProductSchedule {
    const obj = this.inverse();

    if (days) {
      obj['days'] = days;
    }

    let additional = {};

    if (this.quantity) {
      additional['quantity'] = this.quantity;
    }

    if (this.instantiationDate) {
      additional['instantiationDate'] = this.instantiationDate;
    }

    return new ProductSchedule(obj, additional);
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedules.map(s => s.inverse()),
      emailtemplates: this.emailTemplates.map(e => e.inverse()),
      updated_at: this.updatedAtAPI,
      created_at: this.createdAt.format()
    }
  }
}
