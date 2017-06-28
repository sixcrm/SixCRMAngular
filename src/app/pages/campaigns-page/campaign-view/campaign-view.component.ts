import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from '../../../shared/services/campaigns.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {NavigationService} from '../../../navigation/navigation.service';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';

@Component({
  selector: 'campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  emailTemplateMapper = (el: EmailTemplate) => el.name;
  emailTemplateColumnParams = [
    new ColumnParams('Name', (e: EmailTemplate) => e.name),
    new ColumnParams('Subject',(e: EmailTemplate) => e.subject),
    new ColumnParams('Type', (e: EmailTemplate) => e.type),
    new ColumnParams('SMTP Provider Name', (e: EmailTemplate) => e.smtpProvider.name)
  ];

  productScheduleMapper = (el: ProductSchedule) => el.name;
  productScheduleColumnParams = [
    new ColumnParams('Name', (e: ProductSchedule) => e.name),
    new ColumnParams('Products in schedule', (e: ProductSchedule) => e.schedules.length, 'right')
  ];

  constructor(
    service: CampaignsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public emailTemplateService: EmailTemplatesService,
    public productScheduleService: ProductScheduleService,
    private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Campaign();
      this.entityBackup = this.entity.copy();
      this.fetchDependencies()
    } else {
      this.service.entity$.take(1).subscribe(() => this.fetchDependencies());
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetchDependencies(): void {
    this.emailTemplateService.getEntities();
    this.productScheduleService.getEntities();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  viewEmailTemplate(emailTemplate: EmailTemplate): void {
    this.router.navigate(['/emailtemplates', emailTemplate.id]);
  }

  disassociateEmailTemplate(emailTemplate: EmailTemplate): void {
    let index = firstIndexOf(this.entity.emailTemplates, (el) => el.id === emailTemplate.id);

    if (index > -1) {
      this.entity.emailTemplates.splice(index, 1);
      this.entity.emailTemplates = this.entity.emailTemplates.slice();

      if (!this.addMode) {
        this.updateEntity(this.entity);
      }
    }
  }

  associateEmailTemplate(emailTemplate: EmailTemplate): void {
    let list = this.entity.emailTemplates.slice();
    list.push(emailTemplate);

    this.entity.emailTemplates = list;

    if (!this.addMode) {
      this.updateEntity(this.entity);
    }
  }

  viewProductSchedule(productSchedule: ProductSchedule): void {
    this.router.navigate(['/productschedules', productSchedule.id]);
  }

  disassociateProductSchedule(productSchedule: ProductSchedule): void {
    let index = firstIndexOf(this.entity.productSchedules, (el) => el.id === productSchedule.id);

    if (index > -1) {
      this.entity.productSchedules.splice(index, 1);
      this.entity.productSchedules = this.entity.productSchedules.slice();

      if (!this.addMode) {
        this.updateEntity(this.entity);
      }
    }
  }

  associateProductSchedule(productSchedule: ProductSchedule): void {
    let list = this.entity.productSchedules.slice();
    list.push(productSchedule);

    this.entity.productSchedules = list;

    if (!this.addMode) {
      this.updateEntity(this.entity);
    }
  }
}
