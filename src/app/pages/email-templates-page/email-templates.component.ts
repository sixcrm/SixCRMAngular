import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {EmailTemplate} from '../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../shared/services/email-templates.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(emailsService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Name', (e: EmailTemplate) => e.name),
      new ColumnParams('Subject',(e: EmailTemplate) => e.subject),
      new ColumnParams('Type', (e: EmailTemplate) => e.type),
      new ColumnParams('SMTP Provider Name', (e: EmailTemplate) => e.smtpProvider.name)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
