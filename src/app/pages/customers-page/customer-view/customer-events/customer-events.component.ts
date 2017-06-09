import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Activity, compareActivities} from '../../../../shared/models/analytics/activity.model';
import {utc} from 'moment';
import {Customer} from '../../../../shared/models/customer.model';
import {AnalyticsService} from '../../../../shared/services/analytics.service';
import {AsyncSubject} from 'rxjs';
import {EntitiesByDate} from '../../../../shared/models/entities-by-date.interface';

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

  isEmpty: boolean = false;

  activitiesByDate: EntitiesByDate<Activity>[] = [
    {label: 'Today', entities: [], contains: (a: Activity) => utc(a.date).isSame(utc(), 'day')},
    {label: 'Last 7 days', entities: [], contains: (a: Activity) => utc(a.date).isAfter(utc().subtract(7, 'd'))},
    {label: 'Last 30 days', entities: [], contains: (a: Activity) => utc(a.date).isAfter(utc().subtract(30, 'd'))},
    {label: 'Last 90 days', entities: [], contains: (a: Activity) => utc(a.date).isAfter(utc().subtract(90, 'd'))},
    {label: 'Other', entities: [], contains: (a: Activity) => true}
  ];

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.activitiesByCustomer$.takeUntil(this.unsubscribe$).subscribe((activities: Activity[]) => {
      this.hasMore = activities && activities.length === this.limit;
      this.loadingData = false;
      // this.activities = [...this.activities, ...activities];
      this.arrangeActivities(activities)
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

  arrangeActivities(acts: Activity[]): void {
    acts.forEach(activity => {
      for (let i in this.activitiesByDate) {
        if (this.activitiesByDate[i].contains(activity)) {
          this.activitiesByDate[i].entities.push(activity);

          return;
        }
      }
    });

    let empty: boolean = true;
    for (let i in this.activitiesByDate) {
      this.activitiesByDate[i].entities = this.activitiesByDate[i].entities.sort(compareActivities);
      if (this.activitiesByDate[i].entities.length !== 0) {
        empty = false;
      }
    }

    this.isEmpty = empty;
  }
}
