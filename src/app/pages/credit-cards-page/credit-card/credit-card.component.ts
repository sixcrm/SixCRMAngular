import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent extends AbstractEntityComponent<CreditCard> implements OnInit {

  constructor(service: CreditCardsService, progressBarService: ProgressBarService) {
    super(service, progressBarService, () => new CreditCard());
  }

  ngOnInit() {
    this.init();
  }

}
