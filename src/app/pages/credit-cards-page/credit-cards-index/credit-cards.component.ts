import {Component, OnInit, OnDestroy} from '@angular/core';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {MdDialog} from '@angular/material';
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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(creditCardsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new CreditCard();

    this.columnParams = [
      new ColumnParams('CREDITCARD_INDEX_NAME', (e: CreditCard) => e.name),
      new ColumnParams('CREDITCARD_INDEX_EXPIRATION',(e: CreditCard) => e.expiration),
      new ColumnParams('CREDITCARD_INDEX_COUNTRY', (e: CreditCard) => e.address.country),
      new ColumnParams('CREDITCARD_INDEX_STATE', (e: CreditCard) => e.address.state),
      new ColumnParams('CREDITCARD_INDEX_CITY', (e: CreditCard) => e.address.city)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
