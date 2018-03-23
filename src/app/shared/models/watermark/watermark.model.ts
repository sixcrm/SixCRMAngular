import {WatermarkProduct} from './watermark-product.model';
import {WatermarkProductSchedule} from './watermark-product-schedule.model';
import {ProductSchedule} from '../product-schedule.model';
import {Product} from '../product.model';

export class Watermark {
  products: WatermarkProduct[] = [];
  productSchedules: WatermarkProductSchedule[] = [];

  extractedProductSchedules: ProductSchedule[] = [];
  extractedProducts: Product[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    if (obj.products) {
      this.products = obj.products.map(p => new WatermarkProduct(p));

      this.extractedProducts = this.products.map(ps => ps.product);
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
