import {Moment, utc} from 'moment';
import {Entity} from './entity.interface';
import {FulfillmentProvider} from './fulfillment-provider.model';
import {ShippingReceiptHistoryItem} from './shipping-receipt-history-item.model';

export class ShippingReceipt implements Entity<ShippingReceipt> {
  id: string;
  status: string;
  trackingNumber: string;
  fulfillmentProvider: FulfillmentProvider;
  history: ShippingReceiptHistoryItem[] = [];
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.status = obj.status || '';
    this.trackingNumber = obj.trackingnumber || '';
    this.fulfillmentProvider = new FulfillmentProvider(obj.fulfillment_provider);

    if(obj.history) {
      this.history = obj.history.map(h => new ShippingReceiptHistoryItem((h)));
    }

    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);
  }

  copy(): ShippingReceipt {
    return new ShippingReceipt(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      status: this.status,
      trackingnumber: this.trackingNumber,
      fulfillment_provider: this.fulfillmentProvider.inverse(),
      history: this.history.map(h => h.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
