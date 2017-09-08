import {FulfillmentProvider} from './fulfillment-provider.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';

export class Product implements Entity<Product> {
  id: string;
  name: string;
  sku: string;
  ship: string;
  shippingDelay: number;
  defaultPrice: Currency;
  fulfillmentProvider: FulfillmentProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.sku = obj.sku || '';
    this.ship = obj.ship || null;
    this.shippingDelay = obj.shipping_delay || 0;
    this.defaultPrice = new Currency(obj.default_price);
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);
  }

  copy(): Product {
    return new Product(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      sku: this.sku,
      ship: this.ship,
      shipping_delay: this.shippingDelay,
      default_price: this.defaultPrice.amount,
      fulfillment_provider: this.fulfillmentProvider.inverse()
    }
  }
}
