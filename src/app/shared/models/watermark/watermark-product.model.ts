import {Currency} from '../../utils/currency/currency';
import {Product} from '../product.model';

export class WatermarkProduct {
  quantity: number;
  price: Currency;
  product: Product;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.quantity = obj.quantity || 0;
    this.price = new Currency(obj.price);
    this.product = new Product(obj.product);
  }

  copy() {
    return new WatermarkProduct(this.inverse())
  }

  inverse() {
    return {
      quantity: this.quantity,
      price: this.price.amount,
      product: this.product.inverse()
    }
  }
}
