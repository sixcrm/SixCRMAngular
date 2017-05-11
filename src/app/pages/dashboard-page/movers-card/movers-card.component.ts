import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CampaignDelta} from '../../../shared/models/campaign-delta.model';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {Subscription, Observable} from 'rxjs';

@Component({
  selector: 'movers-card',
  templateUrl: './movers-card.component.html',
  styleUrls: ['./movers-card.component.scss']
})
export class MoversCardComponent implements OnInit, OnDestroy {
  @ViewChild('toggleButton') toggleButton;

  campaignDelta: CampaignDelta[] = [];
  showAll: boolean = false;

  private sub: Subscription;

  constructor(private analyticsService: AnalyticsService, private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.sub = this.analyticsService.campaignDelta$.subscribe(data => {
      this.campaignDelta = data;
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

  calculateHeight(): string {
    let count = this.campaignDelta.length;

    if (!this.showAll && count > 5) {
      count = 5;
    }

    return count * 66 + 'px';
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;

    if (this.showAll) {
      Observable.interval(5).take(160).subscribe(() => {
        this.toggleButton.nativeElement.scrollIntoView();
      })
    }
  }
}
