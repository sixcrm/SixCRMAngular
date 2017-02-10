import { Component, OnInit } from '@angular/core';
import {CreditCardsService} from '../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {CreditCard} from '../../shared/models/credit-card.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'c-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent extends AbstractEntityIndexComponent<CreditCard> implements OnInit {

  private creditCards: CreditCard[] = [];

  constructor(
    private creditCardsService: CreditCardsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(creditCardsService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.creditCardsService.entities$.subscribe((data) => {
      this.creditCards = data;
      this.progressBarService.hideTopProgressBar();
    });
    this.creditCardsService.entityDeleted$.subscribe((data) => this.creditCardsService.getEntities());

    this.init();
  }

}
