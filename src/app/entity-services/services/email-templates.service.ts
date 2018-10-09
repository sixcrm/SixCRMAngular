import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {EmailTemplate} from '../../shared/models/email-template.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService, extractData} from '../../shared/services/http-wrapper.service';
import {
  emailTemplatesListQuery, emailTemplateQuery,
  deleteEmailTemplateMutation, createEmailTemplateMutation, updateEmailTemplateMutation, deleteEmailTemplatesMutation,
  sendTestEmailQuery, addEmailTemplateAssociation, removeEmailTemplateAssociation, getEmailBodyPreview
} from '../../shared/utils/queries/entities/email-template.queries';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class EmailTemplatesService extends AbstractEntityService<EmailTemplate> {

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

  addEmailTemplateAssociation(emailTemplateId: string, entityType: 'product' | 'campaign' | 'product_schedule', entityId: string): Observable<CustomServerError | EmailTemplate> {
    return this.queryRequest(addEmailTemplateAssociation(emailTemplateId, entityType, entityId)).map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      const extracted = extractData(data);

      if (!extracted) return null;

      return new EmailTemplate(extracted.addemailtemplateassociation);
    })
  }

  removeEmailTemplateAssociation(emailTemplateId: string, entityType: 'product' | 'campaign' | 'product_schedule', entityId: string) {
    return this.queryRequest(removeEmailTemplateAssociation(emailTemplateId, entityType, entityId)).map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      const extracted = extractData(data);

      if (!extracted) return null;

      return new EmailTemplate(extracted.removeemailtemplateassociation);
    })
  }

  sendTestEmail(emailTemplate: EmailTemplate): Observable<any | CustomServerError> {
    return this.queryRequest(sendTestEmailQuery(emailTemplate))
  }

  getTemplatePreview(body: string): Observable<string> {
    return this.queryRequest(getEmailBodyPreview(body)).map(data => {
      if (data instanceof CustomServerError) return '';

      return extractData(data).emailtemplatepreview.result;
    })
  }

}
