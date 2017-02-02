import {Product} from './product.model';
export class Schedule {
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
}
