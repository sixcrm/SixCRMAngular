import {Product} from './product.model';
import {Entity} from './entity.interface';

export class Schedule implements Entity<Schedule>{
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
    return null;
  }
}
