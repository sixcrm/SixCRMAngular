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
  fullName: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.email = obj.email || '';
    this.firstName = obj.firstname || '';
    this.lastName = obj.lastname || '';
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
    this.phone = obj.phone || '';
    this.address = new Address(obj.address);
    this.createdAt = utc(obj.created_at);
    this.updatedAt = utc(obj.updated_at);

    if (obj.creditcards) {
      this.creditCards = obj.creditcards.map(card => new CreditCard(card));
    }
  }

  copy(): Customer {
    return new Customer(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstName,
      lastname: this.lastName,
      phone: this.phone,
      address: this.address.inverse(),
      creditcards: this.creditCards.map(card => card.inverse()),
      created_at: this.createdAt.format(),
      updated_at: this.updatedAt.format()
    }
  }
}
