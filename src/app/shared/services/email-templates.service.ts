import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../models/email-template.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {emailTemplatesListQuery, emailTemplateQuery, deleteEmailTemplateMutation} from '../utils/query-builder';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new EmailTemplate(data),
      emailTemplatesListQuery,
      emailTemplateQuery,
      deleteEmailTemplateMutation,
      null,
      null,
      'emailtemplate'
    )
  }

}
