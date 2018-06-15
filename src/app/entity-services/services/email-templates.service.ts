import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../../shared/models/email-template.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService, extractData} from '../../shared/services/http-wrapper.service';
import {
  emailTemplatesListQuery, emailTemplateQuery,
  deleteEmailTemplateMutation, createEmailTemplateMutation, updateEmailTemplateMutation, deleteEmailTemplatesMutation
} from '../../shared/utils/queries/entities/email-template.queries';
import {Subject} from 'rxjs';
import {tokenListQuery} from '../../shared/utils/queries/entities/token.queries';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

  tokens: Subject<any> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new EmailTemplate(data),
      emailTemplatesListQuery,
      emailTemplateQuery,
      deleteEmailTemplateMutation,
      deleteEmailTemplatesMutation,
      createEmailTemplateMutation,
      updateEmailTemplateMutation,
      null,
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
