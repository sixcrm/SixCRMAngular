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
}

export class Cycle {

  public position: string;
  public nextPosition: string;
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

    this.position = obj.position || '';
    this.nextPosition = obj.next_position || '';
    this.length = obj.length || 0;
    this.price = new Currency(obj.price || 0);
    this.shippingPrice = new Currency(obj.shipping_price || 0);
    this.monthly = !!obj.monthly;
    if (obj.cycle_products) {
      this.cycleProducts = obj.cycle_products.map(p => new CycleProduct(p));
    }
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
