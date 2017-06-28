import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../models/email-template.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  emailTemplatesListQuery, emailTemplateQuery, deleteEmailTemplateMutation,
  createEmailTemplateMutation, updateEmailTemplateMutation
} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new EmailTemplate(data),
      emailTemplatesListQuery,
      emailTemplateQuery,
      deleteEmailTemplateMutation,
      createEmailTemplateMutation,
      updateEmailTemplateMutation,
      'emailtemplate'
    )
  }

}
