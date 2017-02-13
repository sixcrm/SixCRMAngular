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
    return null;
  }
}
