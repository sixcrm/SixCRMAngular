export class ShippingReceiptTracking {
  id: string;
  carrier: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.carrier = obj.carrier || '';
  }

  copy(): ShippingReceiptTracking {
    return new ShippingReceiptTracking(this.inverse());
  }

  inverse() {
    return {
      id: this.id,
      carrier: this.carrier
    }
  }
}
