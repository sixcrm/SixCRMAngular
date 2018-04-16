import {Address} from './address.model';
import {Entity} from './entity.interface';
import {Customer} from './customer.model';
import {Moment, utc} from 'moment'

export class CreditCard implements Entity<CreditCard> {
  id: string;
  ccnumber: string;
  expiration: string;
  name: string;
  address: Address;
  type: string;
  expirationFormatted: string;
  maskedNumber: string;
  customers: Customer[] = [];
  createdAt: Moment;
  updatedAt: Moment;
  updatedAtAPI: string;
  lastFour: string;
  firstSix: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.ccnumber = obj.number || '';
    this.expiration = obj.expiration || '';
    this.name = obj.name || '';
    this.address = new Address(obj.address);
    this.type = this.getType().toUpperCase();
    this.expirationFormatted = this.formatExpiration();
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.created_at);
    this.updatedAtAPI = obj.updated_at;
    this.lastFour = obj.last_four || '';
    this.firstSix = obj.first_six || '';
    this.maskedNumber = this.maskNumber();

    if (obj.customers) {
      this.customers = obj.customers.map(customer => new Customer(customer));
    }
  }

  copy(): CreditCard {
    return new CreditCard(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      number: this.ccnumber,
      expiration: this.expiration,
      name: this.name,
      address: this.address.inverse(),
      customers: this.customers.map(customer => customer.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAtAPI,
      last_four: this.lastFour,
      first_six: this.firstSix
    }
  }

  getType(): string {
    if (!this.ccnumber || this.ccnumber.length !== 16) return 'other';

    let types = {
      electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
      maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
      dankort: /^(5019)\d+$/,
      interpayment: /^(636)\d+$/,
      unionpay: /^(62|88)\d+$/,
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    for(var type in types) {
      if(types[type].test(this.ccnumber)) {
        return type
      }
    }

    return 'other';
  }

  private formatExpiration() {
    if (!this.expiration || this.expiration.length !== 4) return this.expiration;

    return this.expiration.substr(0, 2) + '/' + this.expiration.substr(2, 4);
  }

  private maskNumber() {
    if (!this.lastFour) return '';

    return `************${this.lastFour}`;
  }
}
