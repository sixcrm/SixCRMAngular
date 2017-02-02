import {FulfillmentProvider} from './fulfillment-provider.model';

export class Product {
  id: string;
  name: string;
  sku: string;
  ship: string;
  shippingDelay: string;
  fulfillmentProvider: FulfillmentProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.sku = obj.sku || '';
    this.ship = obj.ship || '';
    this.shippingDelay = obj.shipping_delay || '';
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);
  }

  copy(): Product {
    return new Product({
      id: this.id,
      name: this.name,
      sku: this.sku,
      ship: this.ship,
      shipping_delay: this.shippingDelay,
      fulfillment_provider: this.fulfillmentProvider.copy()
    })
  }
}
