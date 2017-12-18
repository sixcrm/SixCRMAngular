import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {CampaignStats} from '../../../shared/models/campaign-stats.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'top-campaigns',
  templateUrl: './top-campaigns.component.html',
  styleUrls: ['./top-campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopCampaignsComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  campaigns: CampaignStats[];

  columnParams: ColumnParams<CampaignStats>[] = [
    new ColumnParams('DASHBOARD_TOPCAMPAIGNS_CAMPAIGN', (c: CampaignStats) => c.campaign),
    new ColumnParams('DASHBOARD_TOPCAMPAIGNS_AMOUNT', (c: CampaignStats) => c.amount.usd(), 'right')
  ];
  sortParams: ColumnParams<CampaignStats> = new ColumnParams();
  sortOrder: string = 'asc';

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
      this.campaigns = campaigns;
    })
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
      this.analyticsService.getCampaignsByAmount(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getCampaignsByAmount(this.start.format(), this.end.format(), format);
  }

  sort(params: ColumnParams<CampaignStats>): void {
    if (this.sortParams.label === params.label) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortParams = params;
      this.sortOrder = 'asc';
    }
  }

}
