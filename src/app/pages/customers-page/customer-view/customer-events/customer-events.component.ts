import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Activity} from '../../../../shared/models/analytics/activity.model';
import {utc} from 'moment';
import {Customer} from '../../../../shared/models/customer.model';
import {AnalyticsService} from '../../../../shared/services/analytics.service';
import {AsyncSubject} from 'rxjs';

@Component({
  selector: 'customer-events',
  templateUrl: './customer-events.component.html',
  styleUrls: ['./customer-events.component.scss']
})
export class CustomerEventsComponent implements OnInit, OnDestroy {

  @Input() customer: Customer;

  limit: number = 8;
  offset: number = 0;
  hasMore: boolean;
  loadingData: boolean = false;

  activities: Activity[] = [];

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.activitiesByCustomer$.takeUntil(this.unsubscribe$).subscribe((activities: Activity[]) => {
      this.hasMore = activities && activities.length === this.limit;
      this.loadingData = false;
      this.activities = [...this.activities, ...activities];
      this.offset = this.activities.length;
    });

    this.fetch();
  }

  fetch(): void {
    this.loadingData = true;
    this.analyticsService.getActivityByCustomer(utc().subtract(6, 'M').format(), utc().format(), this.customer.id, this.limit, this.offset);
  }

  onScroll(): void {
    if (!this.loadingData && this.hasMore) {
      this.fetch();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
