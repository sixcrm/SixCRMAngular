import { Injectable } from '@angular/core';
import {Account} from '../models/account.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  accountsListQuery, accountQuery,
  deleteAccountMutation, createAccountMutation, updateAccountMutation, deleteAccountsMutation
} from '../utils/queries/entities/account.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AccountsService extends AbstractEntityService<Account> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Account(data),
      accountsListQuery,
      accountQuery,
      deleteAccountMutation,
      deleteAccountsMutation,
      createAccountMutation,
      updateAccountMutation,
      null,
      'account',
      snackBar
    );
  }

}
