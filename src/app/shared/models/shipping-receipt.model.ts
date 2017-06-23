export class ShippingReceipt {
  id: string;
  created: string;
  modified: string;
  status: string;
  trackingNumber: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.created = obj.created || '';
    this.modified = obj.modified || '';
    this.status = obj.status || '';
    this.trackingNumber = obj.trackingnumber || '';
  }

  copy(): ShippingReceipt {
    return new ShippingReceipt(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      created: this.created,
      modified: this.modified,
      status: this.status,
      trackingnumber: this.trackingNumber
    }
  }
}
