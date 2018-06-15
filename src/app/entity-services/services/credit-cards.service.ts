import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {CreditCard} from '../../shared/models/credit-card.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  creditCardsListQuery, creditCardQuery,
  deleteCreditCardMutation, createCreditCardMutation, updateCreditCardMutation, deleteCreditCardsMutation
} from '../../shared/utils/queries/entities/credit-card.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class CreditCardsService extends AbstractEntityService<CreditCard> {
  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'creditcard',
      snackBar
    );
  }
}
