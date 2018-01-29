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

  parseStatus(): string {
    switch (this.status) {
      case 'pending':
        return 'SHIPPINGRECEIPT_STATUS_PENDING';
      case 'intransit':
        return 'SHIPPINGRECEIPT_STATUS_INTRANSIT';
      case 'delivered':
        return 'SHIPPINGRECEIPT_STATUS_DELIVERED';
      case 'returned':
        return 'SHIPPINGRECEIPT_STATUS_RETURNED';
      case 'unknown':
        return 'SHIPPINGRECEIPT_STATUS_UNKNOWN';
      default:
        return this.status
    }
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
