import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignDelta} from '../../../shared/models/campaign-delta.model';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'movers-card',
  templateUrl: './movers-card.component.html',
  styleUrls: ['./movers-card.component.scss']
})
export class MoversCardComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  campaignDelta: CampaignDelta[];

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.campaignDelta$.takeUntil(this.unsubscribe$).subscribe(campaigns => {
      if (campaigns) {
        if (campaigns instanceof CustomServerError) {
          this.serverError = campaigns;
          this.loading = false;
          this.campaignDelta = null;
          return;
        }

        this.serverError = null;
        this.loading = false;
        if (campaigns.length > 6) {
          this.campaignDelta = campaigns.slice(0,6);
        } else {
          this.campaignDelta = campaigns.slice();
        }
      }
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
      this.loading = true;
      this.analyticsService.getCampaignDelta(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getCampaignDelta(this.start.format(), this.end.format(), format);
  }

  isDecing(campaign: CampaignDelta): boolean {
    return campaign.percentageChangeAmount.indexOf('-') === 0;
  }
}
