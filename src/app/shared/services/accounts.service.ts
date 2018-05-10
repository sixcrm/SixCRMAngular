import { Injectable } from '@angular/core';
import {Account} from '../models/account.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {extractData, HttpWrapperService} from './http-wrapper.service';
import {
  accountsListQuery, accountQuery,
  deleteAccountMutation, createAccountMutation, updateAccountMutation, deleteAccountsMutation, activateAccountMutation,
  createNewAccountMutation
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

  public createNewAccount(accountName: string): Observable<Account | CustomServerError> {
    return this.queryRequest(createNewAccountMutation(accountName), {}, '*').map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      return this.toEntity(entityData);
    });
  }

}
