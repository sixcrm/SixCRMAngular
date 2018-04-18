import {Component, OnInit, OnDestroy} from '@angular/core';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'c-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent extends AbstractEntityIndexComponent<CreditCard> implements OnInit, OnDestroy {

  constructor(
    creditCardsService: CreditCardsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(creditCardsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new CreditCard();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CREDITCARD_INDEX_ID', (e: CreditCard) => e.id).setSelected(false),
      new ColumnParams('CREDITCARD_INDEX_NAME', (e: CreditCard) => e.name),
      new ColumnParams('CREDITCARD_INDEX_EXPIRATION',(e: CreditCard) => e.expiration),
      new ColumnParams('CREDITCARD_INDEX_COUNTRY', (e: CreditCard) => e.address.country),
      new ColumnParams('CREDITCARD_INDEX_STATE', (e: CreditCard) => e.address.state),
      new ColumnParams('CREDITCARD_INDEX_CITY', (e: CreditCard) => e.address.city),
      new ColumnParams('CREDITCARD_INDEX_ZIP', (e: CreditCard) => e.address.zip).setSelected(false),
      new ColumnParams('CREDITCARD_INDEX_LINE1', (e: CreditCard) => e.address.line1).setSelected(false),
      new ColumnParams('CREDITCARD_INDEX_CREATED', (e: CreditCard) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('CREDITCARD_INDEX_UPDATED', (e: CreditCard) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
