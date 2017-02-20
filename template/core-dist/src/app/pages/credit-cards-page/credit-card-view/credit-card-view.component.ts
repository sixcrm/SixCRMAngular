import {Component, OnInit, OnDestroy} from '@angular/core';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-credit-card-view',
  templateUrl: './credit-card-view.component.html',
  styleUrls: ['./credit-card-view.component.scss']
})
export class CreditCardViewComponent extends AbstractEntityViewComponent<CreditCard> implements OnInit, OnDestroy {

  constructor(
    private creditCardsService: CreditCardsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(creditCardsService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new CreditCard();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
