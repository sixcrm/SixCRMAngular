import {Currency} from '../utils/currency/currency';
import {MerchantProviderGroup} from './merchant-provider-group.model';
import {Product} from './product.model';
import {Entity} from './entity.interface';
import {SmsProvider} from './sms-provider.model';

export class ProductSchedule implements Entity<ProductSchedule> {

  public id: string;
  public name: string;
  public cycles: Cycle[] = [];
  public merchantProviderGroup: MerchantProviderGroup;
  public initialCycleSchedulesPrice: Currency = new Currency(0);
  public quantity: number = 1;
  public trialRequired: boolean;
  public smsProvider: SmsProvider;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.merchantProviderGroup = new MerchantProviderGroup(obj.merchantprovidergroup);
    this.smsProvider = new SmsProvider(obj.sms_provider);
    this.trialRequired = !!obj.trial_required;
    if (obj.cycles) {
      this.cycles = obj.cycles.map(c => new Cycle(c));
    }
    this.initialCycleSchedulesPrice = this.getInitialPrice();
  }

  inverse() {
    return {
      id: this.id,
      name: this.name,
      cycles: this.cycles.map(c => c.inverse()),
      merchantprovidergroup: this.merchantProviderGroup.inverse(),
      sms_provider: this.smsProvider.inverse(),
      trial_required: !!this.trialRequired
    }
  }

  copy(): ProductSchedule {
    return new ProductSchedule(this.inverse());
  }

  getInitialPrice(): Currency {
    if (!this.cycles || this.cycles.length === 0) {
      return new Currency(0);
    }

    return this.cycles[0].price
  }

  getInitialSku(): string {
    if (!this.cycles || this.cycles.length === 0) {
      return '';
    }

    if (!this.cycles[0].cycleProducts || !this.cycles[0].cycleProducts[0]) {
      return '';
    }

    return this.cycles[0].cycleProducts[0].product.sku;
  }

  getDefaultImagePath(): string {
    return '/assets/images/product-default-image.svg';
  }

}

export class CycleProduct {
  public product: Product;
  public quantity: number;
  public isShipping: boolean;
  public position: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.isShipping = !!obj.is_shipping;
    this.quantity = obj.quantity || 1;
    this.product = new Product(obj.product);
    this.position = obj.position || 1;
  }

  inverse(): any {
    return {
      is_shipping: this.isShipping,
      quantity: this.quantity,
      product: this.product.inverse(),
      position: this.position
    }
  }

  isValidQuantity() {
    return +this.quantity > 0;
  }

  copy(): CycleProduct {
    return new CycleProduct(this.inverse());
  }
}

export class Cycle {

  public position: number;
  public nextPosition: number;
  public length: number;
  public monthly: boolean;
  public cycleProducts: CycleProduct[] = [];
  public price: Currency;
  public shippingPrice: Currency;
  public dragDiff: number = 0;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.position = obj.position || 0;
    this.nextPosition = obj.next_position || 0;
    this.monthly = this.calculateMonthly(obj);
    this.length = this.calculateLength(obj);
    this.price = new Currency(obj.price || 0);
    this.shippingPrice = new Currency(obj.shipping_price || 0);
    if (obj.cycle_products) {
      this.cycleProducts = obj.cycle_products.map(p => new CycleProduct(p));
    }
  }

  calculateLength(obj) {
    if (!obj.length) return 30;

    return obj.length['month'] || obj.length['months'] || obj.length['day'] || obj.length['days'] || 30;
  }

  calculateMonthly(obj) {
    if (!obj.length) return false;

    return !!(obj.length['month'] || obj.length['months']);
  }

  inverse() {
    const len = {};
    const lenKey = this.monthly ? 'months' : 'days';
    len[lenKey] = this.length;

    return {
      position: this.position,
      next_position: this.nextPosition,
      length: len,
      monthly: this.monthly,
      cycle_products: this.cycleProducts.map(cp => cp.inverse()),
      shipping_price: this.shippingPrice.amount,
      price: this.price.amount
    }
  }

  isValidLength() {
    return +this.length > 0;
  }

  isValid() {
    return this.cycleProducts
      .map(cycleProduct => cycleProduct.isValidQuantity())
      .reduce((a,b) => a && b, this.isValidLength())
  }

  copy() {
    return new Cycle(this.inverse());
  }
}
