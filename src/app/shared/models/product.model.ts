import {FulfillmentProvider} from './fulfillment-provider.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {ProductAttributes} from './product-attributes.model';
import {SixImage} from './six-image.model';

export class Product implements Entity<Product> {
  id: string;
  name: string;
  sku: string;
  ship: boolean;
  shippingDelay: number;
  description: string;
  defaultPrice: Currency;
  attributes: ProductAttributes;
  images: SixImage[] = [];
  fulfillmentProvider: FulfillmentProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.sku = obj.sku || '';
    this.ship = (obj.ship === 'true');
    this.shippingDelay = obj.shipping_delay || 0;
    this.description = obj.description || '';
    this.attributes = new ProductAttributes(obj.attributes);
    this.defaultPrice = new Currency(obj.default_price);
    if (obj.images) {
      this.images = obj.images.map(i => new SixImage(i));
    }
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
      description: this.description,
      attributes: this.attributes.inverse(),
      images: this.images.map(m => m.inverse()),
      fulfillment_provider: this.fulfillmentProvider.inverse()
    }
  }
}
