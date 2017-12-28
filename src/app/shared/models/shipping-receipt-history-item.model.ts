import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';
import {FulfillmentProvider} from './fulfillment-provider.model';

export class ShippingReceiptHistoryItem {
  status: string;
  detail: string;
  createdAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.detail = obj.detail;
    this.status = obj.status || '';
    this.createdAt = utc(obj.created_at);
  }

  copy(): ShippingReceiptHistoryItem {
    return new ShippingReceiptHistoryItem(this.inverse());
  }

  inverse(): any {
    return {
      detail: this.detail,
      status: this.status,
      created_at: this.createdAt.format(),
    }
  }
}
