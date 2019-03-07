import {Currency} from '../utils/currency/currency';

export class CycleProduct {

  public id: string;
  public name: string;
  public quantity: number;
  public isShippable: boolean;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.isShippable = !!obj.is_shippable;
    this.quantity = obj.quantity || 1;
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      is_shippable: this.isShippable,
      quantity: this.quantity
    }
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
    this.length = obj.length || 0;
    this.price = new Currency(obj.price || 0);
    this.shippingPrice = new Currency(obj.shipping_price || 0);
    this.monthly = !!obj.monthly;
    if (obj.cycle_products) {
      this.cycleProducts = obj.cycle_products.map(p => new CycleProduct(p));
    }
  }

  inverse() {
    return {
      position: this.position,
      next_position: this.nextPosition,
      length: this.length,
      monthly: this.monthly,
      cycle_products: this.cycleProducts.map(cp => cp.inverse()),
      shipping_price: this.shippingPrice.amount,
      price: this.price.amount
    }
  }

  copy() {
    return new Cycle(this.inverse());
  }
}

export class ProductScheduleCycles {

  public id: string;
  public name: string;
  public cycles: Cycle[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';

    if (obj.cycles) {
      this.cycles = obj.cycles.map(c => new Cycle(c));
    }
  }

  inverse() {
    return {
      id: this.id,
      name: this.name,
      cycles: this.cycles.map(c => c.inverse())
    }
  }

  copy(): ProductScheduleCycles {
    return new ProductScheduleCycles(this.inverse());
  }

}

export function getSimpleProductSchedule(): ProductScheduleCycles {

  return new ProductScheduleCycles({
    id: '1',
    name: 'sample',
    cycles: [
      {
        position: 1,
        next_position: 2,
        length: 14,
        price: 10,
        cycle_products: [
          {
            id: 'p1',
            name: 'sample product 1',
            is_shippable: true
          }
        ]
      },
      {
        position: 2,
        next_position: 3,
        length: 30,
        price: 10,
        cycle_products: [
          {
            id: 'p1',
            name: 'sample product 1',
            is_shippable: true
          }
        ]
      },
      {
        position: 3,
        next_position: 3,
        length: 30,
        price: 10,
        cycle_products: [
          {
            id: 'p1',
            name: 'sample product 1',
            is_shippable: true
          }
        ]
      }
    ]
  })

}
