import {Product} from './product.model';
import {ShippingReceipt} from './shipping-receipt.model';
import {Currency} from '../utils/currency/currency';
import {Return} from './return.model';
import {Rebill} from './rebill.model';

export class Products {
  amount: Currency;
  product: Product;
  quantity: number;
  shippingReceipt: ShippingReceipt;
  returns: {quantity: number, 'return': Return}[] = [];
  rebill: Rebill;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.amount = new Currency(obj.amount);
    this.product = new Product(obj.product);
    this.quantity = obj.quantity || 0;
    this.shippingReceipt = new ShippingReceipt(obj.shippingreceipt);

    if (obj.returns) {
      this.returns = obj.returns.map(r => {
        return {
          quantity: r.quantity || 0,
          'return': new Return(r)
        };
      });
    }
  }

  isReturnable() {
    if (!this.product.ship) return false;

    const returned = this.returns.map(r => r.quantity).reduce((a,b) => a+b,0);

    return returned < this.quantity;
  }

  copy(): Products {
    return new Products(this.inverse());
  }

  inverse(): any {
    return {
      amount: this.amount.amount,
      product: this.product.inverse(),
      quantity: this.quantity,
      shippingreceipt: this.shippingReceipt.inverse(),
      returns: this.returns.map(r => {
        return {
          quantity: r.quantity,
          'return': r.return.inverse()
        }
      })
    }
  }
}
