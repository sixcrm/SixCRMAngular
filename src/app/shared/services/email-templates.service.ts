import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../models/email-template.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  emailTemplatesListQuery, emailTemplateQuery,
  deleteEmailTemplateMutation, createEmailTemplateMutation, updateEmailTemplateMutation
} from '../utils/queries/entities/email-template.queries';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new EmailTemplate(data),
      emailTemplatesListQuery,
      emailTemplateQuery,
      deleteEmailTemplateMutation,
      createEmailTemplateMutation,
      updateEmailTemplateMutation,
      'emailtemplate',
      snackBar
    )
  }

}
