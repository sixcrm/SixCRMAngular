import {ProductSchedule} from '../product-schedule.model';

export class WatermarkProductSchedule {
  quantity: number;
  productSchedule: ProductSchedule;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.quantity = obj.quantity || 0;
    this.productSchedule = new ProductSchedule(obj.product_schedule);
  }

  copy() {
    return new WatermarkProductSchedule(this.inverse())
  }

  inverse() {
    return {
      quantity: this.quantity,
      product_schedule: this.productSchedule.inverse()
    }
  }
}
