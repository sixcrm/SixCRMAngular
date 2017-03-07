import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Email} from '../models/email.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {emailsListQuery, emailQuery, deleteEmailMutation} from '../utils/query-builder';

@Injectable()
export class EmailsService extends AbstractEntityService<Email> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Email(data),
      emailsListQuery,
      emailQuery,
      deleteEmailMutation,
      null,
      null,
      'email'
    )
  }

}
