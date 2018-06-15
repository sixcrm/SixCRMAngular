import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {EmailTemplatesService} from '../../../../entity-services/services/email-templates.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'email-templates-custom',
  templateUrl: './email-templates-custom.component.html',
  styleUrls: ['./email-templates-custom.component.scss']
})
export class EmailTemplatesCustomComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  @Output() addSelected: EventEmitter<boolean> = new EventEmitter();

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
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_TYPE', (e: EmailTemplate) => e.type),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SMTPPROVIDER', (e: EmailTemplate) => e.smtpProvider.name),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_CREATED', (e: EmailTemplate) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_UPDATED', (e: EmailTemplate) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  copyTemplate(emailTemplate: EmailTemplate) {
    const r = emailTemplate.copy();
    r.name = r.name + ' Copy';

    this.createEntity(r);
  }
}
