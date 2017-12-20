import {Moment, utc} from 'moment';

export class ShippingReceipt {
  id: string;
  status: string;
  trackingNumber: string;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.status = obj.status || '';
    this.trackingNumber = obj.trackingnumber || '';
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
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
