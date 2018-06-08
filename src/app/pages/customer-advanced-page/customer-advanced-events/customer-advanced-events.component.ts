import {Component, OnInit, Input} from '@angular/core';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Activity} from '../../../shared/models/analytics/activity.model';
import {Customer} from '../../../shared/models/customer.model';
import {utc} from 'moment';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'customer-advanced-events',
  templateUrl: './customer-advanced-events.component.html',
  styleUrls: ['./customer-advanced-events.component.scss']
})
export class CustomerAdvancedEventsComponent implements OnInit {


  _customer: Customer;

  activities: Activity[] = [];

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  columnParams: ColumnParams<Activity>[] = [];
  options: string[] = [];

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_ACTIVITY_DATE', (e: Activity) => e.date.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_ACTIVITY_TYPE', (e: Activity) => e.acted_upon_type),
      new ColumnParams('CUSTOMER_ACTIVITY_DESCRIPTION', (e: Activity) => e.description),
      new ColumnParams('CUSTOMER_ACTIVITY_AUTHOR', (e: Activity) => e.actor)
    ];
  }

  initialize() {
    this.analyticsService.activitiesByCustomer$.take(1).subscribe(activities => {
      if (activities instanceof CustomServerError) return;

      this.activities = activities;
    });

    this.analyticsService.getActivityByCustomer(
      utc().subtract(1, 'M').format(),
      utc().format(),
      this._customer.id,
      10,
      0
    );
  }

}
