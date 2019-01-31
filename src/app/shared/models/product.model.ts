import {FulfillmentProvider} from './fulfillment-provider.model';
import {Entity} from './entity.interface';
import {Currency} from '../utils/currency/currency';
import {Moment, utc} from 'moment';
import {EmailTemplate} from './email-template.model';

export class Product implements Entity<Product> {
  id: string;
  name: string;
  sku: string;
  ship: boolean;
  shippingDelay: number;
  description: string;
  defaultPrice: Currency;
  fulfillmentProvider: FulfillmentProvider;
  emailTemplates: EmailTemplate[] = [];
  imageUrls: string[] = [];

  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  quantity: number = 1;
  price: Currency;

  constructor(obj?: any, additional?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.sku = obj.sku || '';
    this.ship = obj.is_shippable;
    this.shippingDelay = obj.shipping_delay || 0;
    this.description = obj.description || '';
    this.defaultPrice = new Currency(obj.price);
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.emailTemplates = (obj.emailtemplates || []).map(e => new EmailTemplate(e));
    this.imageUrls = (obj.image_urls || []);

    if (additional) {
      this.quantity = additional.quantity || 1;
      this.price = additional.price || new Currency(0);
    }
  }

  getDefaultImagePath(): string {
    return this.imageUrls[0] || '/assets/images/product-default-image.svg';
  }

  copy(): Product {
    return new Product(this.inverse())
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      sku: this.sku,
      is_shippable: this.ship,
      shipping_delay: this.shippingDelay,
      price: this.defaultPrice.amount,
      description: this.description,
      fulfillment_provider: this.fulfillmentProvider.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
      emailtemplates: this.emailTemplates.map(e => e.inverse()),
      image_urls: this.imageUrls
    }
  }
}
