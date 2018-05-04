import { Injectable } from '@angular/core';
import {Account} from '../models/account.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  accountsListQuery, accountQuery,
  deleteAccountMutation, createAccountMutation, updateAccountMutation, deleteAccountsMutation, activateAccountMutation
} from '../utils/queries/entities/account.queries';
import {MatSnackBar} from '@angular/material';
import {CustomServerError} from '../models/errors/custom-server-error';
import {Observable} from 'rxjs';
import {Session} from '../models/session.model';

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

  public activateAccount(account: Account, session: Session): Observable<CustomServerError | {activated: boolean, message: string}> {
    return this.queryRequest(activateAccountMutation(account.id, session.id)).map(response => {
      if (response instanceof CustomServerError) return response;

      return response.body.response.data.activateaccount
    });
  }

}
