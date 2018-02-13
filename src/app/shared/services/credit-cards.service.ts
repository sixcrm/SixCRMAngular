import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {CreditCard} from '../models/credit-card.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  creditCardsListQuery, creditCardQuery,
  deleteCreditCardMutation, createCreditCardMutation, updateCreditCardMutation, deleteCreditCardsMutation
} from '../utils/queries/entities/credit-card.queries';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class CreditCardsService extends AbstractEntityService<CreditCard> {
  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new CreditCard(data),
      creditCardsListQuery,
      creditCardQuery,
      deleteCreditCardMutation,
      deleteCreditCardsMutation,
      createCreditCardMutation,
      updateCreditCardMutation,
      'creditcard',
      snackBar
    );
  }
}
