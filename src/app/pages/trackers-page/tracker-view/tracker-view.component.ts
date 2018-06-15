import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../entity-services/services/trackers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../entity-services/services/affiliates.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {CampaignsService} from '../../../entity-services/services/campaigns.service';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  affiliateMapper = (el: Affiliate) => el.name || el.affiliateId;
  affiliateColumnParams: ColumnParams<Affiliate>[];
  affiliateText: TableMemoryTextOptions = {
    title: 'TRACKER_AFFILIATE_TITLE',
    viewOptionText: 'TRACKER_AFFILIATE_VIEW',
    associateOptionText: 'TRACKER_AFFILIATE_ASSOCIATE',
    disassociateOptionText: 'TRACKER_AFFILIATE_DISASSOCIATE',
    associateModalTitle: 'TRACKER_AFFILIATE_ASSOCIATETEXT',
    disassociateModalTitle: 'TRACKER_AFFILIATE_DISASSOCIATETEXT',
    associateModalButtonText: 'TRACKER_AFFILIATE_CONFIRM',
    noDataText: 'TRACKER_AFFILIATE_NODATA',
  };

  campaignMapper = (el: Affiliate) => el.name;
  campaignColumnParams: ColumnParams<Campaign>[];
  campaignText: TableMemoryTextOptions = {
    title: 'TRACKER_CAMPAIGN_TITLE',
    viewOptionText: 'TRACKER_CAMPAIGN_VIEW',
    associateOptionText: 'TRACKER_CAMPAIGN_ASSOCIATE',
    disassociateOptionText: 'TRACKER_CAMPAIGN_DISASSOCIATE',
    associateModalTitle: 'TRACKER_CAMPAIGN_ASSOCIATETEXT',
    disassociateModalTitle: 'TRACKER_CAMPAIGN_DISASSOCIATETEXT',
    associateModalButtonText: 'TRACKER_CAMPAIGN_CONFIRM',
    noDataText: 'TRACKER_CAMPAIGN_NODATA',
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'TRACKER_TAB_GENERAL'},
    {name: 'affiliates', label: 'TRACKER_TAB_AFFILIATE'},
    {name: 'campaigns', label: 'TRACKER_TAB_CAMPAIGN'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'TRACKER_INDEX_TITLE', url: '/trackers'},
    {label: () => this.entity.name}
  ];

  constructor(
    service: TrackersService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public affiliateService: AffiliatesService,
    public campaignService: CampaignsService,
    public authService: AuthenticationService,
    private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Tracker();
      this.entityBackup = this.entity.copy();

      this.affiliateService.getEntities();
      this.campaignService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => {
        this.affiliateService.getEntities();
        this.campaignService.getEntities();
      });
    }

    const f = this.authService.getTimezone();

    this.affiliateColumnParams = [
      new ColumnParams('TRACKER_AFFILIATE_NAME', (e: Affiliate) => e.name),
      new ColumnParams('TRACKER_AFFILIATE_ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('TRACKER_AFFILIATE_CREATED', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('TRACKER_AFFILIATE_UPDATED', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.campaignColumnParams = [
      new ColumnParams('TRACKER_CAMPAIGN_NAME', (e: Campaign) => e.name),
      new ColumnParams('TRACKER_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('TRACKER_CAMPAIGN_UPDATED', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  ngOnDestroy() {
    this.destroy()
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  associateAffiliate(affiliate: Affiliate): void {
    this.cancelUpdate();

    this.entity.affiliates.push(affiliate);
    this.updateEntity(this.entity);
  }

  dissociateAffiliate(affiliate: Affiliate): void {
    let index = firstIndexOf(this.entity.affiliates, (el) => el.id === affiliate.id);

    if (index >= 0) {
      this.entity.affiliates.splice(index, 1);
      this.service.updateEntity(this.entity);
    }
  }

  associateCampaign(campaign: Campaign): void {
    this.cancelUpdate();

    this.entity.campaigns.push(campaign);
    this.updateEntity(this.entity);
  }

  dissociateCampaign(campaign: Campaign): void {
    let index = firstIndexOf(this.entity.campaigns, (el) => el.id === campaign.id);

    if (index >= 0) {
      this.entity.campaigns.splice(index, 1);
      this.service.updateEntity(this.entity);
    }
  }

  viewAffiliate(affiliate: Affiliate): void {
    this.router.navigate(['/affiliates', affiliate.id]);
  }

  viewCampaign(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }
}

