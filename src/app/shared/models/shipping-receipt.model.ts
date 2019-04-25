import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';
import {FulfillmentProvider} from './fulfillment-provider.model';
import {ShippingReceiptHistoryItem} from './shipping-receipt-history-item.model';
import {ShippingReceiptTracking} from "./shipping-receipt-tracking.model";
import {sortByCreatedAtFn} from '../utils/array.utils';
import {Rebill} from './rebill.model';

export class ShippingReceipt implements Entity<ShippingReceipt> {
  id: string;
  status: string;
  tracking: ShippingReceiptTracking;
  fulfillmentProvider: FulfillmentProvider;
  fulfillmentProviderReference: string;
  history: ShippingReceiptHistoryItem[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  rebill: Rebill;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.status = obj.status || '';
    this.tracking = new ShippingReceiptTracking(obj.tracking);
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);
    this.fulfillmentProviderReference = obj.fulfillment_provider_reference || '';
    this.rebill = new Rebill(obj.rebill);

    if(obj.history) {
      this.history = obj.history.map(h => new ShippingReceiptHistoryItem((h))).sort(sortByCreatedAtFn('desc'));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
    this.updatedAtAPI = obj.updated_at;
  }

  isDelivered(): boolean {
    return this.status === 'DELIVERED' || this.status === 'delivered' || this.status === 'Delivered';
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
      fulfillment_provider_reference: this.fulfillmentProviderReference,
      history: this.history.map(h => h.inverse()),
      rebill: this.rebill.inverse(),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI
    }
  }
}
