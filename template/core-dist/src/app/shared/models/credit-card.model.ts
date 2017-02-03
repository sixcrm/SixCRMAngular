import {Address} from './address.model';
export class CreditCard {
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
}
