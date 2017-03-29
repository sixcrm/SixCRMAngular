import {Product} from './product.model';
import {Entity} from './entity.interface';

export class Schedule implements Entity<Schedule>{
  id: string;
  price: string;
  start: string;
  end: string;
  period: string;
  product: Product;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.price = obj.price || '';
    this.start = obj.start || '';
    this.end = obj.end || '';
    this.period = obj.period || '';
    this.product = new Product(obj.product);
  }

  copy(): Schedule {
    return new Schedule(this.inverse())
  }

  inverse(): any {
    return {
      price: this.price,
      start: this.start,
      end: this.end,
      period: this.period,
      product: this.product.inverse()
    }
  }
}
