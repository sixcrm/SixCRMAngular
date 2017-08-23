import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CreditCard} from '../../../../shared/models/credit-card.model';

@Component({
  selector: 'customer-credit-card-view',
  templateUrl: './customer-credit-card-view.component.html',
  styleUrls: ['./customer-credit-card-view.component.scss']
})
export class CustomerCreditCardViewComponent implements OnInit {

  @Input() creditCards: CreditCard[];
  @Output() addCreditCard: EventEmitter<boolean> = new EventEmitter();
  @Output() editCreditCard: EventEmitter<CreditCard> = new EventEmitter();
  @Output() deleteCreditCard: EventEmitter<CreditCard> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
