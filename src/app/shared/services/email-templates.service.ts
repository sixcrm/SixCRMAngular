import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../models/email-template.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  emailTemplatesListQuery, emailTemplateQuery,
  deleteEmailTemplateMutation, createEmailTemplateMutation, updateEmailTemplateMutation
} from '../utils/queries/entities/email-template.queries';
import {MdSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {tokenListQuery} from '../utils/queries/entities/token.queries';
import {CustomServerError} from '../models/errors/custom-server-error';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

  tokens: Subject<any> = new Subject();

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

  getTokens() {
    this.queryRequest(tokenListQuery()).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      const extracted = extractData(data);

      if (!extracted || !extracted.tokenlist || !extracted.tokenlist.tokens.properties[0]) return;

      this.tokens.next(extracted.tokenlist.tokens.properties[0]);
    })
  }

}
