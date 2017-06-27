import {Component, OnInit, OnDestroy} from '@angular/core';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'c-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent extends AbstractEntityIndexComponent<CreditCard> implements OnInit, OnDestroy {

  constructor(
    creditCardsService: CreditCardsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(creditCardsService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Name', (e: CreditCard) => e.name),
      new ColumnParams('Expiration',(e: CreditCard) => e.expiration),
      new ColumnParams('Country', (e: CreditCard) => e.address.country),
      new ColumnParams('State', (e: CreditCard) => e.address.state),
      new ColumnParams('City', (e: CreditCard) => e.address.city)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
