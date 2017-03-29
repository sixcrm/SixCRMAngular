import { Component, OnInit } from '@angular/core';
import {CreditCardsService} from '../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {CreditCard} from '../../shared/models/credit-card.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent extends AbstractEntityIndexComponent<CreditCard> implements OnInit {

  constructor(
    creditCardsService: CreditCardsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(creditCardsService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.init();
  }

}
