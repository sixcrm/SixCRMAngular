import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {MerchantProviderGroup} from './merchant-provider-group.model';
import {Moment, utc} from 'moment';
import {Currency} from '../utils/currency/currency';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  quantity: number;
  firstSchedulePrice: Currency = new Currency(0);
  firstSchedule: Schedule = new Schedule();
  schedules: Schedule[] = [];
  schedulesOnDay: Schedule[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  start: number;
  end: number;

  constructor(obj?: any, additional?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.quantity = additional && additional.quantity ? additional.quantity : 1;
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;

    if (obj.schedule) {
      this.schedules = obj.schedule.map(s => new Schedule(s, obj.days));
      this.firstSchedule = this.calculateFirstSchedule();
      this.firstSchedulePrice = this.firstSchedule ? this.firstSchedule.price : new Currency(0);
      this.start = this.getStart();
      this.end = this.getEnd();
    }
  }

  calculateFirstSchedule(): Schedule {
    let start = this.schedules[0] ? this.schedules[0].start : 0;
    let schedule = this.schedules[0] ? this.schedules[0] : new Schedule;

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start === 0) {
        return this.schedules[i];
      }

      if (this.schedules[i].start < start) {
        start = this.schedules[i].start;
        schedule = this.schedules[i];
      }
    }

    return schedule;
  }

  calculateSchedulesOnDay(day: number): Schedule[] {
    let schedules = [];

    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules[i].start === day || (this.schedules[i].end <= day && this.schedules[i].period % day === 0)) {
        schedules.push(this.schedules[i])
      }
    }

    return schedules;
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

    return new ProductSchedule(obj, additional);
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedules.map(s => s.inverse()),
      updated_at: this.updatedAtAPI,
      created_at: this.createdAt.format()
    }
  }
}
