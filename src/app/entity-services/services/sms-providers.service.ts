import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {SmsProvider} from '../../shared/models/sms-provider.model';
import {HttpWrapperService, FailStrategy} from '../../shared/services/http-wrapper.service';
import {
  smsProvidersListQuery, smsProviderQuery,
  deleteSmsProviderMutation, createSmsProviderMutation, updateSmsProviderMutation,
  deleteSmsProvidersMutation, validateSmsProviderQuery
} from '../../shared/utils/queries/entities/sms-provider.queries';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class SmsProvidersService extends AbstractEntityService<SmsProvider> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new SmsProvider(data),
      smsProvidersListQuery,
      smsProviderQuery,
      deleteSmsProviderMutation,
      deleteSmsProvidersMutation,
      createSmsProviderMutation,
      updateSmsProviderMutation,
      null,
      'smsprovider',
      snackBar
    );
  }

  validate(smsProvider: SmsProvider, phoneNumber: string): Observable<any> {
    return this.queryRequest(validateSmsProviderQuery(smsProvider, phoneNumber), {failStrategy: FailStrategy.Soft});
  }

}
