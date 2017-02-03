import {Address} from './address.model';
import {CreditCard} from './credit-card.model';

export class Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
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

    if (obj.creditcards) {
      for (let i = 0; i < obj.creditcards.length; i++) {
        this.creditCards.push(new CreditCard(obj.creditcards[i]));
      }
    }
  }
}
