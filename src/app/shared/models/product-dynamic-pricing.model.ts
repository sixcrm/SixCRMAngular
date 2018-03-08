import {Currency} from '../utils/currency/currency';
export class ProductDynamicPricing {

  enabled: boolean;
  min: Currency;
  max: Currency;

  constructor(obj?: any) {
    if (!obj) {
      this.enabled = false;
      return;
    }

    this.enabled = true;
    this.min = new Currency(obj.min);
    this.max = new Currency(obj.max);
  }

  inverse() {
    return {
      min: this.min ? this.min.amount : null,
      max: this.max ? this.max.amount : null
    }
  }
}
