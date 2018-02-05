import {Dimensions3d} from './dimensions3d.model';
import {Weight} from './weight.model';
import {SixImage} from './six-image.model';

export class ProductAttributes {

  dimensions: Dimensions3d;
  weight: Weight;
  images: SixImage[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.dimensions = new Dimensions3d(obj.dimensions);
    this.weight = new Weight(obj.weight);
    if (obj.images) {
      this.images = obj.images.map(i => new SixImage(i))
    }
  }

  copy(): ProductAttributes {
    return new ProductAttributes(this.inverse())
  }

  inverse(): any {
    return {
      dimensions: this.dimensions.inverse(),
      weight: this.weight.inverse(),
      images: this.images.map(i => i.inverse())
    }
  }
}
