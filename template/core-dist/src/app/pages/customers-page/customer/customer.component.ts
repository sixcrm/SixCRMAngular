import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {CreditCard} from '../../../shared/models/credit-card.model';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends AbstractEntityComponent<Customer> implements OnInit {

  private creditCards: CreditCard[] = [];

  constructor(service: CustomersService, progressBarService: ProgressBarService, private creditCardsService: CreditCardsService) {
    super(service, progressBarService, () => new Customer());
  }

  ngOnInit() {
    this.init();

    console.log(this.mode);

    this.creditCardsService.entities$.subscribe((cc: CreditCard[]) => this.creditCards = cc);
    this.creditCardsService.getEntities();
  }

  addCreditCard(creditCard): void {
    if (this.mode === 'add') {
      this.entity.creditCards.push(creditCard)
    } else {
      this.entityCopy.creditCards.push(creditCard)
    }
  }

  removeCreditCard(creditCard): void {
    let ccards = this.mode === 'add' ? this.entity.creditCards : this.entityCopy.creditCards;

    let index = -1;

    for (let i = 0; i < ccards.length; i++) {
      if (ccards[i].id === creditCard.id) {
        index = i;
      }
    }

    if (index !== -1) {
      if (this.mode === 'add') {
        this.entity.creditCards.splice(index, 1);
      } else {
        this.entityCopy.creditCards.splice(index, 1);
      }
    }
  }

}
