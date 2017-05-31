import {Product} from './product.model';
import {ShippingReceipt} from './shipping-receipt.model';
import {Currency} from '../utils/currency/currency';

export class Products {
  amount: Currency;
  product: Product;
  shippingReceipt: ShippingReceipt;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.amount = new Currency(obj.amount);
    this.product = new Product(obj.product);
    this.shippingReceipt = new ShippingReceipt(obj.shippingreceipt);
  }
}
