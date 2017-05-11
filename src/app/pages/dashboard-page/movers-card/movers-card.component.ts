import {Component, OnInit, OnDestroy} from '@angular/core';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CampaignDelta} from '../../../shared/models/campaign-delta.model';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'movers-card',
  templateUrl: './movers-card.component.html',
  styleUrls: ['./movers-card.component.scss']
})
export class MoversCardComponent implements OnInit, OnDestroy {
  campaignDelta: CampaignDelta[] = [];
  height: string = '0';

  private sub: Subscription;

  constructor(private analyticsService: AnalyticsService, private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.sub = this.analyticsService.campaignDelta$.subscribe(data => {
      if (data && data.length > 5) {
        this.campaignDelta = data.slice(0,5);
      } else {
        this.campaignDelta = data;
      }

      this.height = this.campaignDelta.length * 66 + 'px';
      this.progressBarService.hideTopProgressBar();
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  isDecing(campaign: CampaignDelta): boolean {
    return campaign.percentageChangeAmount.indexOf('-') === 0;
  }
}
