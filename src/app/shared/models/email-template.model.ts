import {SmtpProvider} from './smtp-provider.model';
import {Entity} from './entity.interface';
import {utc, Moment} from 'moment';
import {Product} from './product.model';
import {Campaign} from './campaign.model';
import {ProductSchedule} from './product-schedule.model';

export function typeMapper(type: string): string {
  switch (type) {
    case 'initialorders': return 'Initial Order';
    case 'allorders': return 'All Orders';
    case 'initialfulfillment': return 'Initial Fulfillment';
    case 'allfulfillments': return 'All Fulfillments';
    case 'delivery': return 'Delivery';
    case 'cancellation': return 'Order Cancellation';
    case 'return': return 'Return';
    case 'refund': return 'Refund';
    case 'decline': return 'All Declines';
  }

  return ''
}

export class EmailTemplate implements Entity<EmailTemplate> {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  smtpProvider: SmtpProvider;
  preview: string;
  products: Product[] = [];
  campaigns: Campaign[] = [];
  productSchedules: ProductSchedule[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.subject = obj.subject || '';
    this.body = obj.body || '';
    this.type = obj.type || '';
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
    this.smtpProvider = new SmtpProvider(obj.smtp_provider);
    this.preview = obj.preview || '';

    if (obj.products) {
      this.products = obj.products.map(p => new Product(p));
    }

    if (obj.campaigns) {
      this.campaigns = obj.campaigns.map(c => new Campaign(c));
    }

    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(p => new ProductSchedule(p));
    }
  }

  getTypeFormatted() {
    return typeMapper(this.type);
  };

  copy(): EmailTemplate {
    return new EmailTemplate(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      subject: this.subject,
      body: this.body,
      type: this.type,
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
      smtp_provider: this.smtpProvider.inverse(),
      campaigns: this.campaigns.map(c => c.inverse()),
      products: this.products.map(p => p.inverse()),
      product_schedules: this.productSchedules.map(p => p.inverse())
    }
  }
}
