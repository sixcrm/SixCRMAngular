export class SixImage {

  path: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.path = obj.path || '';

  }

  copy(): SixImage {
    return new SixImage(this.inverse())
  }

  inverse(): any {
    return {
      path: this.path
    }
  }
}
