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
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  emailTemplateMapper = (el: EmailTemplate) => el.name;
  emailTemplateColumnParams = [
    new ColumnParams('CAMPAIGN_EMAIL_NAME', (e: EmailTemplate) => e.name),
    new ColumnParams('CAMPAIGN_EMAIL_SUBJECT',(e: EmailTemplate) => e.subject),
    new ColumnParams('CAMPAIGN_EMAIL_TYPE', (e: EmailTemplate) => e.type),
    new ColumnParams('CAMPAIGN_EMAIL_SMTPPROVIDER', (e: EmailTemplate) => e.smtpProvider.name)
  ];

  productScheduleMapper = (el: ProductSchedule) => el.name;
  productScheduleColumnParams = [
    new ColumnParams('CAMPAIGN_PRODUCTSCHEDULE_NAME', (e: ProductSchedule) => e.name),
    new ColumnParams('CAMPAIGN_PRODUCTSCHEDULE_PRODUCTNUMBER', (e: ProductSchedule) => e.schedules.length, 'right').setNumberOption(true)
  ];

  affiliateMapper = (el: Affiliate) => el.name || el.id;
  affiliateColumnParams = [
    new ColumnParams('CAMPAIGN_AFFILIATE_NAME', (e: Affiliate) => e.name || e.id)
  ];

  allAffiliates: Affiliate[] = [];

  emailText: TableMemoryTextOptions = {
    title: 'CAMPAIGN_EMAIL_TITLE',
    viewOptionText: 'CAMPAIGN_EMAIL_VIEW',
    associateOptionText: 'CAMPAIGN_EMAIL_ADD',
    disassociateOptionText: 'CAMPAIGN_EMAIL_REMOVE',
    associateModalTitle: 'CAMPAIGN_EMAIL_ADDTEXT',
    disassociateModalTitle: 'CAMPAIGN_EMAIL_REMOVETEXT',
    associateModalButtonText: 'CAMPAIGN_EMAIL_ADDBUTTON',
    noDataText: 'CAMPAIGN_EMAIL_NODATA'
  };

  productscheduleText: TableMemoryTextOptions = {
    title: 'CAMPAIGN_PRODUCTSCHEDULE_TITLE',
    viewOptionText: 'CAMPAIGN_PRODUCTSCHEDULE_VIEW',
    associateOptionText: 'CAMPAIGN_PRODUCTSCHEDULE_ADD',
    disassociateOptionText: 'CAMPAIGN_PRODUCTSCHEDULE_REMOVE',
    associateModalTitle: 'CAMPAIGN_PRODUCTSCHEDULE_ADDTEXT',
    disassociateModalTitle: 'CAMPAIGN_PRODUCTSCHEDULE_REMOVETEXT',
    associateModalButtonText: 'CAMPAIGN_PRODUCTSCHEDULE_ADDBUTTON',
    noDataText: 'CAMPAIGN_PRODUCTSCHEDULE_NODATA'
  };

  affiliateAllowText: TableMemoryTextOptions = {
    title: 'CAMPAIGN_AFFILIATEALLOWED_TITLE',
    viewOptionText: 'CAMPAIGN_AFFILIATEALLOWED_VIEW',
    associateOptionText: 'CAMPAIGN_AFFILIATEALLOWED_ADD',
    disassociateOptionText: 'CAMPAIGN_AFFILIATEALLOWED_REMOVE',
    associateModalTitle: 'CAMPAIGN_AFFILIATEALLOWED_ADDTEXT',
    disassociateModalTitle: 'CAMPAIGN_AFFILIATEALLOWED_REMOVETEXT',
    associateModalButtonText: 'CAMPAIGN_AFFILIATEALLOWED_ADDBUTTON',
    noDataText: 'CAMPAIGN_AFFILIATEALLOWED_NODATA'
  };

  affiliateDenyText: TableMemoryTextOptions = {
    title: 'CAMPAIGN_AFFILIATEDENIED_TITLE',
    viewOptionText: 'CAMPAIGN_AFFILIATEDENIED_VIEW',
    associateOptionText: 'CAMPAIGN_AFFILIATEDENIED_ADD',
    disassociateOptionText: 'CAMPAIGN_AFFILIATEDENIED_REMOVE',
    associateModalTitle: 'CAMPAIGN_AFFILIATEDENIED_ADDTEXT',
    disassociateModalTitle: 'CAMPAIGN_AFFILIATEDENIED_REMOVETEXT',
    associateModalButtonText: 'CAMPAIGN_AFFILIATEDENIED_ADDBUTTON',
    noDataText: 'CAMPAIGN_AFFILIATEDENIED_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'CAMPAIGN_TAB_GENERAL'},
    {name: 'productschedules', label: 'CAMPAIGN_TAB_PRODUCTSCHEDULES'},
    {name: 'affiliates', label: 'CAMPAIGN_TAB_AFFILIATES'},
    {name: 'trackingcode', label: 'CAMPAIGN_TAB_TRACKINGCODE'}
  ];

  constructor(
    service: CampaignsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public emailTemplateService: EmailTemplatesService,
    public productScheduleService: ProductScheduleService,
    private router: Router,
    private affiliateService: AffiliatesService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Campaign();
      this.entityBackup = this.entity.copy();
      this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(() => this.fetchDependencies());
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.fetchDependencies());
    }

    this.affiliateService.entities$.takeUntil(this.unsubscribe$).take(1).subscribe(affiliates => {
      if (affiliates instanceof CustomServerError) {
        this.allAffiliates = [];
        return;
      }

      let starAffiliate = [new Affiliate()];
      starAffiliate[0].name = 'All';
      starAffiliate[0].id = '*';

      this.allAffiliates = [...starAffiliate, ...affiliates];
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetchDependencies(): void {
    this.emailTemplateService.getEntities();
    this.productScheduleService.getEntities();
    this.affiliateService.getEntities();
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

      this.update();
    }
  }

  associateEmailTemplate(emailTemplate: EmailTemplate): void {
    let list = this.entity.emailTemplates.slice();
    list.push(emailTemplate);

    this.entity.emailTemplates = list;

    this.update();
  }

  viewProductSchedule(productSchedule: ProductSchedule): void {
    this.router.navigate(['/productschedules', productSchedule.id]);
  }

  disassociateProductSchedule(productSchedule: ProductSchedule): void {
    let index = firstIndexOf(this.entity.productSchedules, (el) => el.id === productSchedule.id);

    if (index > -1) {
      this.entity.productSchedules.splice(index, 1);
      this.entity.productSchedules = this.entity.productSchedules.slice();

      this.update();
    }
  }

  associateProductSchedule(productSchedule: ProductSchedule): void {
    let list = this.entity.productSchedules.slice();
    list.push(productSchedule);

    this.entity.productSchedules = list;

    this.update();
  }

  associateAllowAffiliate(affiliate: Affiliate): void {
    let list = this.entity.affiliateAllow.slice();
    list.push(affiliate);

    this.entity.affiliateAllow = list;

    this.update();
  }

  disassociateAllowAffiliate(affiliate: Affiliate): void {
    let index = firstIndexOf(this.entity.affiliateAllow, (el) => el.id === affiliate.id);

    if (index > -1) {
      this.entity.affiliateAllow.splice(index, 1);
      this.entity.affiliateAllow = this.entity.affiliateAllow.slice();

      this.update();
    }
  }

  associateDeniedAffiliate(affiliate: Affiliate): void {
    let list = this.entity.affiliateDeny.slice();
    list.push(affiliate);

    this.entity.affiliateDeny = list;

    this.update();
  }

  disassociateDeniedAffiliate(affiliate: Affiliate): void {
    let index = firstIndexOf(this.entity.affiliateDeny, (el) => el.id === affiliate.id);

    if (index > -1) {
      this.entity.affiliateDeny.splice(index, 1);
      this.entity.affiliateDeny = this.entity.affiliateDeny.slice();
      this.update();
    }
  }

  viewAffiliate(affiliate: Affiliate): void {
    if (affiliate.id == '*') return;

    this.router.navigate(['/affiliates', affiliate.id]);
  }

  update(): void {
    if (!this.addMode) {
      this.updateEntity(this.entity);
    }
  }
}
