import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {CreditCardsService} from '../../../../entity-services/services/credit-cards.service';
import {CreditCard} from '../../../../shared/models/credit-card.model';

@Component({
  selector: 'perfect-credit-card',
  templateUrl: './perfect-credit-card.component.html',
  styleUrls: ['./perfect-credit-card.component.scss']
})
export class PerfectCreditCardComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  creditCard: CreditCard;

  constructor(private creditCardService: CreditCardsService) {
    super();
  }

  ngOnInit() {
    this.creditCardService.entity$.takeUntil(this.unsubscribe$).subscribe(creditCard => {
      if (creditCard instanceof CustomServerError) {
        this.serverError = creditCard;
        return;
      }

      this.serverError = null;
      this.creditCard = creditCard
    });

    this.creditCardService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetchPerfect() {
    this.creditCard = undefined;

    this.creditCardService.getEntity(this._id);
  }

}
