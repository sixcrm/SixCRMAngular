import {Schedule} from './schedule.model';
import {Entity} from './entity.interface';
import {MerchantProviderGroup} from './merchant-provider-group.model';
import {Moment, utc} from 'moment';

export class ProductSchedule implements Entity<ProductSchedule> {
  id: string;
  name: string;
  quantity: number;
  schedules: Schedule[] = [];
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
      this.start = this.getStart();
      this.end = this.getEnd();
    }
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
