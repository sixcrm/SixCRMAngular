import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {EmailTemplatesSharedService} from '../../../../shared/services/email-templates-shared.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'email-templates-shared',
  templateUrl: './email-templates-shared.component.html',
  styleUrls: ['./email-templates-shared.component.scss']
})
export class EmailTemplatesSharedComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  constructor(
    emailsService: EmailTemplatesSharedService,
    auth: AuthenticationService,
    dialog: MdDialog,
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
    this.viewAfterCrate = false;

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      this.viewEntity(entity.id, true)
    });

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

  viewEntity(id: string, noShared?: boolean): void {
    let params = [id];
    if (!noShared) params.unshift('shared');

    this.router.navigate(params, {relativeTo: this.activatedRoute});
  }
}
