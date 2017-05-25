import {Address} from './address.model';
import {Entity} from './entity.interface';

export class CreditCard implements Entity<CreditCard> {
  id: string;
  ccnumber: string;
  expiration: string;
  ccv: string;
  name: string;
  address: Address;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.ccnumber = obj.number || '';
    this.expiration = obj.expiration || '';
    this.ccv = obj.ccv || '';
    this.name = obj. name || '';
    this.address = new Address(obj.address);
  }

  copy(): CreditCard {
    return new CreditCard(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      number: this.ccnumber,
      expiration: this.expiration,
      ccv: this.ccv,
      name: this.name,
      address: this.address.inverse()
    };
  }


  getLastFour(): string {
    if (this.ccnumber.length <= 4) return this.ccnumber;

    return this.ccnumber.substring(this.ccnumber.length - 4, this.ccnumber.length);
  }
}
