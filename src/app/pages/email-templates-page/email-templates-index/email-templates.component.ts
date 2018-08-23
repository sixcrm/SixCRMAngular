import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'c-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'EMAILTEMPLATE_INDEX_TITLE'}];

  constructor(emailsService: EmailTemplatesService,
              auth: AuthenticationService,
              dialog: MatDialog,
              paginationService: PaginationService,
              router: Router,
              activatedRoute: ActivatedRoute) {

    super(emailsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new EmailTemplate();
    this.openInEditModeAfterCreation = true;

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_ID', (e: EmailTemplate) => e.id).setSelected(false),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_NAME', (e: EmailTemplate) => e.name),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SUBJECT', (e: EmailTemplate) => e.subject),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_TYPE', (e: EmailTemplate) => e.getTypeFormatted()),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SMTPPROVIDER', (e: EmailTemplate) => e.smtpProvider.name),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_CREATED', (e: EmailTemplate) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_UPDATED', (e: EmailTemplate) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
    ];
  }

  openAddMode() {
    super.openAddMode();
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  copyTemplate(emailTemplate: EmailTemplate) {
    const copy = emailTemplate.copy();
    copy.name += '(copy)';

    this.createEntity(copy);
  }
}