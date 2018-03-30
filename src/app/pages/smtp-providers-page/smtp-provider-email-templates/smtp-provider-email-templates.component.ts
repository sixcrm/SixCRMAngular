import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {
  emailTemplatesListBySmtpProviderQuery,
  emailTemplatesListQuery
} from '../../../shared/utils/queries/entities/email-template.queries';
import {IndexQueryParameters} from '../../../shared/utils/queries/index-query-parameters.model';

@Component({
  selector: 'smtp-provider-email-templates',
  templateUrl: './smtp-provider-email-templates.component.html',
  styleUrls: ['./smtp-provider-email-templates.component.scss']
})
export class SmtpProviderEmailTemplatesComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  @Input() smtpProvider: SmtpProvider;

  constructor(
    emailTemplatesService: EmailTemplatesService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
    super(emailTemplatesService, auth, dialog, paginationService);

    this.columnParams = [
      new ColumnParams('SMTP_EMAILTEMPLATE_NAME', (e: EmailTemplate) => e.name),
      new ColumnParams('SMTP_EMAILTEMPLATE_SUBJECT', (e: EmailTemplate) => e.subject),
      new ColumnParams('SMTP_EMAILTEMPLATE_TYPE', (e: EmailTemplate) => e.type)
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => emailTemplatesListBySmtpProviderQuery(this.smtpProvider.id, params);
    this.takeUpdated = false;
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = emailTemplatesListQuery;
    this.destroy();
  }

}
