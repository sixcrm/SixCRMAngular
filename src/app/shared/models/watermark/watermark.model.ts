import {WatermarkProduct} from './watermark-product.model';
import {WatermarkProductSchedule} from './watermark-product-schedule.model';
import {ProductSchedule} from '../product-schedule.model';

export class Watermark {
  products: WatermarkProduct[] = [];
  productSchedules: WatermarkProductSchedule[] = [];

  extractedProductSchedules: ProductSchedule[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    if (obj.products) {
      this.products = obj.products.map(p => new WatermarkProduct(p));
    }

    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(ps => new WatermarkProductSchedule(ps));

      this.extractedProductSchedules = this.productSchedules.map(ps => ps.productSchedule);
    }
  }

  copy(): Watermark {
    return new Watermark(this.inverse());
  }

  inverse() {
    return {
      products: this.products.map(p => p.inverse()),
      product_schedules: this.productSchedules.map(ps => ps.inverse())
    }
  }
}
