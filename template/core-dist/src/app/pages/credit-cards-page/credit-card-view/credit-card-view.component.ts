import { Component, OnInit } from '@angular/core';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'c-credit-card-view',
  templateUrl: './credit-card-view.component.html',
  styleUrls: ['./credit-card-view.component.scss']
})
export class CreditCardViewComponent implements OnInit {

  private creditCard: CreditCard;

  constructor(private creditCardsService: CreditCardsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.creditCardsService.entity$.subscribe((data) => this.creditCard = data);
    this.route.params.subscribe((params) => this.creditCardsService.getEntity(params['id']));
  }

}
