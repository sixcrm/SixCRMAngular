import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {SmtpProvider} from '../models/smtp-provider.model';
import {
  smtpProvidersListQuery, smtpProviderQuery, deleteSmptProviderMutation,
  createSmptProviderMutation, updateSmptProviderMutation
} from '../utils/query-builder';

@Injectable()
export class SmtpProvidersService extends AbstractEntityService<SmtpProvider> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new SmtpProvider(data),
      smtpProvidersListQuery,
      smtpProviderQuery,
      deleteSmptProviderMutation,
      createSmptProviderMutation,
      updateSmptProviderMutation
    );
  }
}
