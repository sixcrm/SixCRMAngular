import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService, extractData} from '../../shared/services/http-wrapper.service';
import {MatSnackBar} from '@angular/material';
import {AccountDetails, CustomBlock} from '../../shared/models/account-details.model';
import {
  accountDetailsQuery,
  updateAccountDetailsMutation
} from '../../shared/utils/queries/entities/account-details.queries';
import {Observable, Subject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

@Injectable()
export class AccountDetailsService extends AbstractEntityService<AccountDetails> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new AccountDetails(data),
      null,
      accountDetailsQuery,
      null,
      null,
      null,
      updateAccountDetailsMutation,
      null,
      'accountdetail',
      snackBar
    );
  }

  addCustomBlock(block: CustomBlock): Observable<boolean> {
    if (!this.hasWritePermission()) {
      return Observable.of(false);
    }

    return this.queryRequest(accountDetailsQuery(null)).flatMap(data => {
      if (data instanceof CustomServerError) {
        return [false]
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData = json[entityKey];

      const accountDetails = new AccountDetails(entityData);

      accountDetails.emailTemplateSettings.customBlocks.push(block);

      return this.queryRequest(updateAccountDetailsMutation(accountDetails)).flatMap(updateData => {
        if (updateData instanceof CustomServerError) {
          return [false]
        }

        this.openSnackBar('SNACK_UPDATED');

        return [true];
      })
    })
  }

  removeCustomBlock(block: CustomBlock): Observable<boolean> {
    if (!this.hasWritePermission()) {
      return Observable.of(false);
    }

    return this.queryRequest(accountDetailsQuery(null)).flatMap(data => {
      if (data instanceof CustomServerError) {
        return [false];
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData = json[entityKey];

      const accountDetails = new AccountDetails(entityData);

      accountDetails.emailTemplateSettings.customBlocks = accountDetails.emailTemplateSettings.customBlocks.filter(cb => cb.id !== block.id);

      return this.queryRequest(updateAccountDetailsMutation(accountDetails)).flatMap(updateData => {
        if (updateData instanceof CustomServerError) {
          return [false];
        }

        this.openSnackBar('SNACK_UPDATED');

        return [true];
      })
    })
  }

}
