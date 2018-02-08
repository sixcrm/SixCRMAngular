export class SixImage {

  path: string;
  filename: string;
  raw: string;
  name: string;
  description: string;
  defaultImage: boolean;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.path = obj.path || '';
    this.filename = obj.filename || '';
    this.raw = obj.raw || '';
    this.name = obj.name || '';
    this.description = obj.description || '';
    this.defaultImage = obj.default_image;
  }

  copy(): SixImage {
    return new SixImage(this.inverse())
  }

  inverse(): any {
    return {
      path: this.path,
      filename: this.filename,
      raw: this.raw,
      name: this.name,
      description: this.description,
      default_image: this.defaultImage
    }
  }
}
