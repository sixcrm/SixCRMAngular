import {WatermarkProduct} from './watermark-product.model';
import {WatermarkProductSchedule} from './watermark-product-schedule.model';
import {ProductSchedule} from '../product-schedule-legacy.model';
import {Product} from '../product.model';
import {Moment} from 'moment';

export class Watermark {
  products: WatermarkProduct[] = [];
  productSchedules: WatermarkProductSchedule[] = [];

  extractedProductSchedules: ProductSchedule[] = [];
  extractedProducts: Product[] = [];

  private instantiationDate: Moment;

  constructor(obj?: any, instantiationDate?: Moment) {
    if (!obj) {
      obj = {};
    }

    this.instantiationDate = instantiationDate ? instantiationDate.clone() : null;

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

        if (this.instantiationDate) {
          additional['instantiationDate'] = this.instantiationDate.clone();
        }

        return new ProductSchedule(productSchedule, additional);
      });
    }
  }

  copy(): Watermark {
    return new Watermark(this.inverse(), this.instantiationDate);
  }

  inverse() {
    return {
      products: this.products.map(p => p.inverse()),
      product_schedules: this.productSchedules.map(ps => ps.inverse())
    }
  }
}
