import { Injectable } from '@angular/core';
import {Account} from '../../shared/models/account.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import { extractData, FailStrategy, HttpWrapperService, RetryStrategy } from '../../shared/services/http-wrapper.service';
import {
  accountsListQuery, accountQuery,
  deleteAccountMutation, createAccountMutation, updateAccountMutation, deleteAccountsMutation, activateAccountMutation,
  createNewAccountMutation, deactivateAccountMutation
} from '../../shared/utils/queries/entities/account.queries';
import {MatSnackBar} from '@angular/material';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Observable} from 'rxjs';
import {Session} from '../../shared/models/session.model';

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

  public deactivateAccount(account: Account): Observable<CustomServerError | {deactivate: string, message: string}> {
    return this.queryRequest(deactivateAccountMutation(account.id)).map(response => {
      if (response instanceof CustomServerError) return response;

      return response.body.response.data.deactivateaccount
    });
  }

  public createNewAccount(accountName: string): Observable<Account | CustomServerError> {
    return this.queryRequest(createNewAccountMutation(accountName), {ignoreSnack: true, failStrategy: FailStrategy.Soft, retry: { strategy: RetryStrategy.Retry }}, '*').map(data => {
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
