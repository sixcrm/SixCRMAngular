import {Product} from './product.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';

export class Schedule implements Entity<Schedule>{
  id: string;
  price: Currency;
  start: number;
  end: number;
  period: number;
  product: Product;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.price = new Currency(obj.price);
    this.start = obj.start || 0;
    this.end = obj.end;
    this.period = obj.period || 0;
    this.product = new Product(obj.product);
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
}
