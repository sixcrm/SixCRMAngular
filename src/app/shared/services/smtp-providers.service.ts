import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {SmtpProvider} from '../models/smtp-provider.model';
import {HttpWrapperService} from './http-wrapper.service';
import {
  smtpProvidersListQuery, smtpProviderQuery,
  deleteSmptProviderMutation, createSmptProviderMutation, updateSmptProviderMutation, validateSmtpProviderQuery,
  deleteSmptProvidersMutation
} from '../utils/queries/entities/smtp-provider.queries';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class SmtpProvidersService extends AbstractEntityService<SmtpProvider> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new SmtpProvider(data),
      smtpProvidersListQuery,
      smtpProviderQuery,
      deleteSmptProviderMutation,
      deleteSmptProvidersMutation,
      createSmptProviderMutation,
      updateSmptProviderMutation,
      null,
      'smtpprovider',
      snackBar
    );
  }

  validate(smtpProvider: SmtpProvider, email: string): Observable<any> {
    return this.queryRequest(validateSmtpProviderQuery(smtpProvider, email));
  }
}
