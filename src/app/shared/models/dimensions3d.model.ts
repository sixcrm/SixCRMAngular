import {Measure} from './measure.model';
export class Dimensions3d {

  width: Measure;
  height: Measure;
  length: Measure;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.width = new Measure(obj.width);
    this.height = new Measure(obj.height);
    this.length = new Measure(obj.length);

  }

  copy(): Dimensions3d {
    return new Dimensions3d(this.inverse())
  }

  inverse(): any {
    return {
      width: this.width.inverse(),
      height: this.height.inverse(),
      length: this.length.inverse()
    }
  }
}
