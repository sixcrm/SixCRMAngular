import {Component, OnInit, OnDestroy} from '@angular/core';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {Modes} from '../../abstract-entity-view.component';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'c-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'EMAILTEMPLATE_INDEX_TITLE'}];

  modes = Modes;
  selectedIndex: number = 0;
  addMode: boolean;
  entity: EmailTemplate = new EmailTemplate();

  tabHeaders: TabHeaderElement[] = [
    {name: 'custom', label: 'EMAILTEMPLATE_TAB_CUSTOM'},
    {name: 'shared', label: 'EMAILTEMPLATE_TAB_SHARED'}
  ];

  createSub: Subscription;

  constructor(
    private emailTemplateService: EmailTemplatesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() { }

  ngOnDestroy() {
    if (this.createSub) {
      this.createSub.unsubscribe();
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  copyShared(emailTemplate: EmailTemplate) {
    this.entity = emailTemplate.copy();
    this.entity.name += ' Copy';
    this.entity.smtpProvider = new SmtpProvider();

    this.toggleAddModal();
  }

  addTemplate() {
    this.entity = new EmailTemplate();

    this.toggleAddModal();
  }

  toggleAddModal() {
    this.addMode = !this.addMode;
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'full-overlay') {
      this.toggleAddModal();
    }
  }

  createEntity(template: EmailTemplate) {
    this.createSub = this.emailTemplateService.entityCreated$.take(1).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      this.viewEntity(entity.id, true)
    });

    this.emailTemplateService.createEntity(template);
  }

  closeAddMode() {
    this.addMode = false;
    this.entity = new EmailTemplate();
  }

  viewEntity(id: string, editMode?: boolean): void {
    let params = [id];
    let query = {};
    if (editMode) {
      query['edit'] = true;
    }

    this.router.navigate(params, {relativeTo: this.activatedRoute, queryParams: query});
  }
}
