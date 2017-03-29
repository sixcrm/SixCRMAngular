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
}
