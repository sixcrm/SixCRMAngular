import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {EmailTemplatesSharedService} from '../../../../shared/services/email-templates-shared.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'email-templates-shared',
  templateUrl: './email-templates-shared.component.html',
  styleUrls: ['./email-templates-shared.component.scss']
})
export class EmailTemplatesSharedComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  @Output() copySelected: EventEmitter<EmailTemplate> = new EventEmitter();

  constructor(
    emailsService: EmailTemplatesSharedService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(emailsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new EmailTemplate();
    this.openInEditModeAfterCreation = true;

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_ID', (e: EmailTemplate) => e.id).setSelected(false),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_NAME', (e: EmailTemplate) => e.name),
      new ColumnParams('EMAILTEMPLATE_INDEX_HEADER_SUBJECT',(e: EmailTemplate) => e.subject),
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
    this.copySelected.emit(emailTemplate);
  }

  viewEntity(id: string): void {
    this.router.navigate(['shared', id], {relativeTo: this.activatedRoute});
  }
}
