import {Product} from './product.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';

export class Cycle {
  diff: number;

  constructor(public start: number, public end: number) {
    this.diff = end - start;
  };
}

export class Schedule implements Entity<Schedule>{
  id: string;
  price: Currency;
  start: number;
  end: number;
  period: number;
  product: Product;
  cycles: Cycle[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.price = new Currency(obj.price);
    this.start = obj.start || 0;
    this.end = obj.end === undefined ? 30 : obj.end;
    this.period = obj.period || 30;
    this.product = new Product(obj.product);
    this.cycles = this.calculateCyclesForDays(365);
  }

  copy(): Schedule {
    return new Schedule(this.inverse())
  }

  inverse(): any {
    return {
      price: this.price.amount,
      start: this.start,
      end: this.end,
      period: this.period,
      product: this.product.inverse()
    }
  }

  calculateCyclesForDays(days: number) {
    let cycles = [];

    if (this.end === undefined && !this.period) {
      cycles.push(new Cycle(0, days));

      return cycles;
    }

    const end = this.end || days;
    const period = this.period || end;

    let start = this.start;

    while (start < end) {
      cycles.push(new Cycle(start, start + period <= days ? start + period : days));
      start = start + period;
    }

    return cycles;
  }
}
