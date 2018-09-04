import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {EmailTemplatePreviewModalComponent} from '../../../dialog-modals/email-template-preview-modal/email-template-preview-modal.component';

@Component({
  selector: 'c-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent extends AbstractEntityIndexComponent<EmailTemplate> implements OnInit, OnDestroy {

  sortBy: {label: string, sortFunction: (f: EmailTemplate, s: EmailTemplate) => number}[] = [
    {label: 'Name', sortFunction: (f: EmailTemplate, s: EmailTemplate) => {
      if ((f.name || '').toLowerCase() < (s.name || '').toLowerCase()) return -1;
      if ((f.name || '').toLowerCase() > (s.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Type', sortFunction: (f: EmailTemplate, s: EmailTemplate) => {
      if ((f.type || '').toLowerCase() < (s.type || '').toLowerCase()) return -1;
      if ((f.type || '').toLowerCase() > (s.type || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'SMTP Provider', sortFunction: (f: EmailTemplate, s: EmailTemplate) => {
      if ((f.smtpProvider.name || '').toLowerCase() < (s.smtpProvider.name || '').toLowerCase()) return -1;
      if ((f.smtpProvider.name || '').toLowerCase() > (s.smtpProvider.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Subject', sortFunction: (f: EmailTemplate, s: EmailTemplate) => {
      if ((f.subject || '').toLowerCase() < (s.subject || '').toLowerCase()) return -1;
      if ((f.subject || '').toLowerCase() > (s.subject || '').toLowerCase()) return 1;
      return 0;
    }}
  ];

  selectedSortBy: {label: string, sortFunction: (f: EmailTemplate, s: EmailTemplate) => number};

  crumbItems: BreadcrumbItem[] = [{label: () => 'Email Templates'}];

  filterString: string;
  filterFunction = (template: EmailTemplate) => template.name;

  constructor(emailsService: EmailTemplatesService,
              auth: AuthenticationService,
              dialog: MatDialog,
              paginationService: PaginationService,
              router: Router,
              activatedRoute: ActivatedRoute) {
    super(emailsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new EmailTemplate();
  }

  openAddMode() {
    super.openAddMode();
  }

  ngOnInit() {
    this.limit = 100;
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  applySortBy(sort: {label: string, sortFunction: (f: EmailTemplate, s: EmailTemplate) => number}) {
    this.selectedSortBy = sort;
    this.entities = this.entities.sort(sort.sortFunction);
  }

  previewTemplate(template: EmailTemplate) {
    let ref = this.deleteDialog.open(EmailTemplatePreviewModalComponent);
    ref.componentInstance.body = template.preview;

    ref.afterClosed().subscribe(() => {
      ref = null;
    })
  }
}