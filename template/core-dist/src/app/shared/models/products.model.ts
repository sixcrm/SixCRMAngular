import {Product} from './product.model';
import {ShippingReceipt} from './shipping-receipt.model';

export class Products {
  amount: string;
  product: Product;
  shippingReceipt: ShippingReceipt;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.amount = obj.amount || '';
    this.product = new Product(obj.product);
    this.shippingReceipt = new ShippingReceipt(obj.shippingreceipt);
  }
}
