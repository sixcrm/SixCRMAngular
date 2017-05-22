import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignDelta} from '../../../shared/models/campaign-delta.model';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';

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
        if (campaigns.length > 5) {
          this.campaignDelta = campaigns.slice(0,5);
        } else {
          this.campaignDelta = campaigns;
        }
      }
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getCampaignDelta(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  isDecing(campaign: CampaignDelta): boolean {
    return campaign.percentageChangeAmount.indexOf('-') === 0;
  }
}
