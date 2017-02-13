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
    this.ccnumber = obj.ccnumber || '';
    this.expiration = obj.expiration || '';
    this.ccv = obj.ccv || '';
    this.name = obj. name || '';
    this.address = new Address(obj.address);
  }

  copy(): CreditCard {
    return null;
  }
}
