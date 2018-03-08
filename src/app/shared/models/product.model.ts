import {FulfillmentProvider} from './fulfillment-provider.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {ProductAttributes} from './product-attributes.model';
import {Moment, utc} from 'moment';
import {SixImage} from './six-image.model';
import {ProductDynamicPricing} from './product-dynamic-pricing.model';

export class Product implements Entity<Product> {
  id: string;
  name: string;
  sku: string;
  ship: boolean;
  shippingDelay: number;
  description: string;
  defaultPrice: Currency;
  attributes: ProductAttributes;
  fulfillmentProvider: FulfillmentProvider;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  dynamicPrice: ProductDynamicPricing;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.sku = obj.sku || '';
    this.ship = obj.ship;
    this.shippingDelay = obj.shipping_delay || 0;
    this.description = obj.description || '';
    this.attributes = new ProductAttributes(obj.attributes);
    this.defaultPrice = new Currency(obj.default_price);
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.dynamicPrice = new ProductDynamicPricing(obj.dynamic_pricing);
  }

  getDefaultImage(): SixImage {
    if (!this.attributes || !this.attributes.images || this.attributes.images.length === 0) return null;

    const defs = this.attributes.images.filter(i => i.defaultImage);

    if (defs && defs.length > 0) return defs[0];

    return this.attributes.images[0];
  }

  getDefaultImagePath(): string {
    const image = this.getDefaultImage();

    if (!image) return '';

    return image.path;
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
      fulfillment_provider: this.fulfillmentProvider.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
      dynamic_pricing: this.dynamicPrice.enabled ? this.dynamicPrice.inverse() : null
    }
  }
}
