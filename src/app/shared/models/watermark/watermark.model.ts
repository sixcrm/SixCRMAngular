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

      this.extractedProducts = this.products.map(p => {
        const product = p.product.inverse();
        const additional = {price: p.price, quantity: p.quantity};

        return new Product(product, additional);
      });
    }

    if (obj.product_schedules) {
      this.productSchedules = obj.product_schedules.map(ps => new WatermarkProductSchedule(ps));

      this.extractedProductSchedules = this.productSchedules.map(ps => {
        const productSchedule = ps.productSchedule.inverse();
        const additional = {quantity: ps.quantity};

        return new ProductSchedule(productSchedule, additional);
      });
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
