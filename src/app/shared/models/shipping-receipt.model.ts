import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';
import {FulfillmentProvider} from './fulfillment-provider.model';
import {ShippingReceiptHistoryItem} from './shipping-receipt-history-item.model';
import {ShippingReceiptTracking} from "./shipping-receipt-tracking.model";
import {sortByCreatedAtFn} from '../utils/array.utils';

export class ShippingReceipt implements Entity<ShippingReceipt> {
  id: string;
  status: string;
  tracking: ShippingReceiptTracking;
  fulfillmentProvider: FulfillmentProvider;
  history: ShippingReceiptHistoryItem[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.status = obj.status || '';
    this.tracking = new ShippingReceiptTracking(obj.tracking);
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);

    if(obj.history) {
      this.history = obj.history.map(h => new ShippingReceiptHistoryItem((h))).sort(sortByCreatedAtFn('desc'));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
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

  copy(): ShippingReceipt {
    return new ShippingReceipt(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      status: this.status,
      tracking: this.tracking.inverse(),
      fulfillment_provider: this.fulfillmentProvider.inverse(),
      history: this.history.map(h => h.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
