import { Component, OnInit } from '@angular/core';
import {CreditCardsService} from '../../shared/services/credit-cards.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {CreditCard} from '../../shared/models/credit-card.model';

@Component({
  selector: 'c-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent extends AbstractEntityIndexComponent implements OnInit {

  private creditCards: CreditCard[] = [];

  constructor(private creditCardsService: CreditCardsService, router: Router, route: ActivatedRoute) {
    super(creditCardsService, router, route);
  }

  ngOnInit() {
    this.creditCardsService.entities$.subscribe((data) => this.creditCards = data);
    this.creditCardsService.getEntities();
  }

}
