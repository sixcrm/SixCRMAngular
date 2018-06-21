import {Product} from './product.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Moment} from 'moment';

export class Cycle {
  diff: number;
  dragDiff: number = 0;
  dragdiffDiff: number = 0;
  order: number = 0;
  stack: number = 0;
  dragdiffDays: number = 0;

  dragInProgress: boolean = false;
  periodDragInProgress: boolean = false;
  durationDragInProgress: boolean = false;

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
  sameDayOfMonth: boolean;

  product: Product;
  cycles: Cycle[] = [];

  instantiationDate: Moment;

  constructor(obj?: any, days?: number) {
    if (!obj) {
      obj = {};
    }

    this.price = new Currency(obj.price);
    this.start = obj.start || 0;
    this.end = obj.end === undefined ? 30 : obj.end;
    this.period = obj.period;
    this.sameDayOfMonth = !!obj.samedayofmonth;
    this.product = new Product(obj.product);
    this.instantiationDate = obj.instantiationDate ? obj.instantiationDate.clone() : null;
    this.cycles = this.calculateCyclesForDays(days || 365);
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
      samedayofmonth: !!this.sameDayOfMonth,
      instantiationDate: this.instantiationDate ? this.instantiationDate.clone() : null,
      product: this.product.inverse()
    }
  }

  recalculateCyclesForDays(days: number) {
    this.cycles = this.calculateCyclesForDays(days);
  }

  calculateCyclesForDays(days: number) {
    let cycles = [];

    if (this.end === undefined && !this.period && !this.sameDayOfMonth) {
      cycles.push(new Cycle(0, days));

      return cycles;
    }

    const end = +(this.end || days);

    let period = this.sameDayOfMonth ? 30 : this.period && +this.period > 0 ? +this.period : end;
    let start = +this.start;

    while (start < end) {

      if (this.sameDayOfMonth && this.instantiationDate) {
        const startDate = this.instantiationDate.add(start, 'd');
        const monthFromStartDate = startDate.clone().add(1, 'M');

        period = monthFromStartDate.diff(startDate, 'd');
      }

      cycles.push(new Cycle(start, start + period <= end ? start + period : end));
      start = start + period;
    }

    return cycles;
  }
}
