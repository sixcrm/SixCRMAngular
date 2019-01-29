import {Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {CampaignStats} from '../../../shared/models/campaign-stats.model';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import * as moment from 'moment-timezone';

@Component({
  selector: 'top-campaigns',
  templateUrl: './top-campaigns.component.html',
  styleUrls: ['./top-campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopCampaignsComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  campaigns: CampaignStats[];

  campaignsToShow: CampaignStats[];

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.campaignsByAmount$.takeUntil(this.unsubscribe$).subscribe(campaigns => {
      if (campaigns instanceof CustomServerError) {
        this.serverError = campaigns;
        this.campaigns = null;
        return;
      }

      this.serverError = null;

      if (!campaigns) return;

      const sortFunction = (first: CampaignStats, second: CampaignStats) => {
        if (first.amount.amount > second.amount.amount) return -1;

        if (first.amount.amount < second.amount.amount) return 1;

        return 0;
      };

      if (campaigns.length > 5) {
        this.campaigns = campaigns.slice(0,5).sort(sortFunction);
      } else {
        this.campaigns = campaigns.sort(sortFunction);
      }
    });

    this.start = moment().subtract(30, 'd');
    this.end = moment();
    this.shouldFetch = true;
  }

  ngOnDestroy() {
    this.destroy();
  }

  refreshData() {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getCampaignsByAmount({start: this.start.format(), end: this.end.format()});
      this.shouldFetch = false;
    }
  }

  calculateLineWidth(index: number): string {
    if (index === 0) return '100%';

    const biggest = this.campaigns[0].amount.amount;
    const current = this.campaigns[index].amount.amount;

    let value = (current / biggest) * 100;

    if (value < 1) {
      value = 1;
    }

    return value + '%'
  }
}
