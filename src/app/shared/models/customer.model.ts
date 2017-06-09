import {Address} from './address.model';
import {CreditCard} from './credit-card.model';
import {Entity} from './entity.interface';
import {Moment, utc} from 'moment';

export class Customer implements Entity<Customer> {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: Moment;
  updatedAt: Moment;
  address: Address;
  creditCards: CreditCard[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.email = obj.email || '';
    this.firstName = obj.firstname || '';
    this.lastName = obj.lastname || '';
    this.phone = obj.phone || '';
    this.address = new Address(obj.address);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    if (obj.creditcards) {
      for (let i = 0; i < obj.creditcards.length; i++) {
        this.creditCards.push(new CreditCard(obj.creditcards[i]));
      }
    }
  }

  copy(): Customer {
    return new Customer(this.inverse());
  }

  inverse(): any {
    let ccards = [];
    for (let index in this.creditCards) {
      ccards.push(this.creditCards[index].inverse());
    }

    return {
      id: this.id,
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      phone: this.phone,
      address: this.address.inverse(),
      creditcards: ccards
    }
  }

  getMutation(): string {
    let line1 = this.address.line1 ? `line1:"${this.address.line1}"` : '';
    let line2 = this.address.line2 ? `line2:"${this.address.line2}"` : '';
    let city = this.address.city ? `city:"${this.address.city}"` : '';
    let state = this.address.state ? `state:"${this.address.state}"` : '';
    let zip = this.address.zip ? `zip:"${this.address.zip}"` : '';
    let country = this.address.country ? `country:"${this.address.country}"` : '';
    let creditCards: string = '';
    for (let index in this.creditCards) {
      let creditCard = this.creditCards[index];
      if (creditCard.id) {
        creditCards += `"${creditCard.id}" `;
      }
    }

    return `
      id: "${this.id}" email: "${this.email}" firstname: "${this.firstName}" lastname: "${this.lastName}" phone: "${this.phone}",
      address: { ${line1} ${line2} ${city} ${state} ${zip} ${country} }
      creditcards:[${creditCards}]
    `
  }
}
