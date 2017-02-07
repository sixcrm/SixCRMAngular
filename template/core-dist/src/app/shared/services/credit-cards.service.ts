import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {CreditCard} from '../models/credit-card.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {creditCardsListQuery, creditCardQuery, deleteCreditCardMutation} from '../utils/query-builder';

@Injectable()
export class CreditCardsService extends AbstractEntityService<CreditCard> {
  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new CreditCard(data),
      creditCardsListQuery,
      creditCardQuery,
      deleteCreditCardMutation
    );
  }
}
