import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

@Component({
  selector: 'c-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  constructor(
    emailsService: EmailTemplatesService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(emailsService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new EmailTemplate();
    this.openInEditModeAfterCreation = true;

    this.columnParams = [
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_NAME', (e: EmailTemplate) => e.name),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SUBJECT',(e: EmailTemplate) => e.subject),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_TYPE', (e: EmailTemplate) => e.type),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SMTPPROVIDER', (e: EmailTemplate) => e.smtpProvider.name)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
