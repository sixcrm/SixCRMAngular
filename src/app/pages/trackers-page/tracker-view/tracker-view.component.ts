import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Affiliate} from '../../../shared/models/affiliate.model';
import 'codemirror/mode/htmlmixed/htmlmixed';
import {CodemirrorComponent} from 'ng2-codemirror';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Campaign} from '../../../shared/models/campaign.model';
import {CampaignsService} from '../../../shared/services/campaigns.service';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  affiliateMapper = (el: Affiliate) => el.name;
  affiliateColumnParams: ColumnParams<Affiliate>[];

  campaignMapper = (el: Affiliate) => el.name;
  campaignColumnParams: ColumnParams<Campaign>[];

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
      new ColumnParams('Name', (e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('Created At', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.campaignColumnParams = [
      new ColumnParams('Name', (e: Campaign) => e.name),
      new ColumnParams('Created At', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
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

