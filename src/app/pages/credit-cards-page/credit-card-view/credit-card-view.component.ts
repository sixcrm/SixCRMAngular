import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'credit-card-view',
  templateUrl: './credit-card-view.component.html',
  styleUrls: ['./credit-card-view.component.scss']
})
export class CreditCardViewComponent extends AbstractEntityViewComponent<CreditCard> implements OnInit {

  constructor(service: CreditCardsService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    super.init();
  }

}
