import {Dimensions3d} from './dimensions3d.model';
import {Weight} from './weight.model';

export class ProductAttributes {

  dimensions: Dimensions3d;
  weight: Weight;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.dimensions = new Dimensions3d(obj.dimensions);
    this.weight = new Weight(obj.weight);
  }

  copy(): ProductAttributes {
    return new ProductAttributes(this.inverse())
  }

  inverse(): any {
    return {
    }
  }
}
