import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {CreditCard} from '../models/credit-card.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  creditCardsListQuery, creditCardQuery, deleteCreditCardMutation,
  createCreditCardMutation, updateCreditCardMutation
} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class CreditCardsService extends AbstractEntityService<CreditCard> {
  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new CreditCard(data),
      creditCardsListQuery,
      creditCardQuery,
      deleteCreditCardMutation,
      createCreditCardMutation,
      updateCreditCardMutation,
      'creditcard'
    );
  }
}
