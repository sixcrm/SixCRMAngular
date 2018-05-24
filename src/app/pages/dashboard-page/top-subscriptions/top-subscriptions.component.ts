import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractDashboardItem} from "../abstract-dashboard-item.component";
import {AnalyticsService} from "../../../shared/services/analytics.service";
import {CustomServerError} from "../../../shared/models/errors/custom-server-error";
import {SubscriptionStats} from "../../../shared/models/subscription-stats.model";
import {utc} from 'moment';

@Component({
  selector: 'top-subscriptions',
  templateUrl: './top-subscriptions.component.html',
  styleUrls: ['./top-subscriptions.component.scss']
})
export class TopSubscriptionsComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  subscriptions: SubscriptionStats[] = [];

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.subscriptionsByAmount$.takeUntil(this.unsubscribe$).subscribe(subscriptions => {
      if (subscriptions instanceof CustomServerError) {
        this.serverError = subscriptions;
        this.subscriptions = null;
        return;
      }

      this.serverError = null;

      if (!subscriptions) return;

      const sortFunction = (first: SubscriptionStats, second: SubscriptionStats) => {
        if (first.amount.amount > second.amount.amount) return -1;

        if (first.amount.amount < second.amount.amount) return 1;

        return 0;
      };

      if (subscriptions.length > 5) {
        this.subscriptions = subscriptions.slice(0,5).sort(sortFunction);
      } else {
        this.subscriptions = subscriptions.sort(sortFunction);
      }
    });

    this.start = utc().subtract(30, 'd');
    this.end = utc();
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
      this.analyticsService.getSubscriptionsByAmount(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }


  calculateLineWidth(index: number): string {
    if (index === 0) return '100%';

    const biggest = this.subscriptions[0].amount.amount;
    const current = this.subscriptions[index].amount.amount;

    let value = (current / biggest) * 100;

    if (value < 1) {
      value = 1;
    }

    return value + '%'
  }

}
