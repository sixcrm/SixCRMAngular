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

  activities: Activity[] = [];

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.activitiesByCustomer$.takeUntil(this.unsubscribe$).subscribe((activities: Activity[]) => {
      this.activities = activities;
    });

    this.analyticsService.getActivityByCustomer(this.customer.createdAt.format(), utc().format(), this.customer.id, 5, 0);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
