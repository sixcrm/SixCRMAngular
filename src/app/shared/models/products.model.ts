import {Product} from './product.model';
import {ShippingReceipt} from './shipping-receipt.model';
import {Currency} from '../utils/currency/currency';

export class Products {
  amount: Currency;
  product: Product;
  quantity: number;
  shippingReceipt: ShippingReceipt;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.amount = new Currency(obj.amount);
    this.product = new Product(obj.product);
    this.quantity = obj.quantity || 0;
    this.shippingReceipt = new ShippingReceipt(obj.shippingreceipt);
  }

  copy(): Products {
    return new Products(this.inverse());
  }

  inverse(): any {
    return {
      amount: this.amount.amount,
      product: this.product.inverse(),
      shippingreceipt: this.shippingReceipt.inverse()
    }
  }
}
