import { Injectable } from '@angular/core';
import {Account} from '../models/account.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  accountsListQuery, accountQuery,
  deleteAccountMutation, createAccountMutation, updateAccountMutation
} from '../utils/queries/entities/account.queries';

@Injectable()
export class AccountsService extends AbstractEntityService<Account> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Account(data),
      accountsListQuery,
      accountQuery,
      deleteAccountMutation,
      createAccountMutation,
      updateAccountMutation,
      'account'
    );
  }

}
