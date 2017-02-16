import {Entity} from './entity.interface';

export class Address implements Entity<Address> {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.line1 = obj.line1 || '';
    this.line2 = obj.line2 || '';
    this.city = obj.city || '';
    this.state = obj.state || '';
    this.zip = obj.zip || '';
    this.country = obj.country || '';
  }

  copy(): Address {
    return new Address(this.inverse());
  }

  inverse(): any {
    return {
      line1: this.line1,
      line2: this.line2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country
    }
  }
}
