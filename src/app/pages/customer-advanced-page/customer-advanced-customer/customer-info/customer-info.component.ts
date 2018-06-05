import {Component, OnInit, Input} from '@angular/core';
import {CreditCard} from '../../../../shared/models/credit-card.model';
import {Customer} from '../../../../shared/models/customer.model';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  _customer: Customer;
  _defaultCreditCard: CreditCard;

  @Input() set customer(customer: Customer) {
    if (customer) {
      this._customer = customer.copy();
      this._defaultCreditCard = this.getDefaultCard();
    }
  };

  constructor() { }

  ngOnInit() {
  }

  getDefaultCard(): CreditCard {
    if (!this._customer) return null;

    for (let card of this._customer.creditCards) {
      if (card.id === this._customer.defaultCreditCard) {
        return card.copy();
      }
    }

    return null;
  }

}
