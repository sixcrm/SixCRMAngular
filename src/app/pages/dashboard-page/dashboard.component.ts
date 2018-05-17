import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {AsyncSubject} from 'rxjs';
import { DashboardType } from './dashboard-type';
import { DashboardAvailabilityService } from './dashboard-availability.service';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public DashboardType: any = DashboardType;
  activeDashboard: DashboardType;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private dashboardAvailabilityService: DashboardAvailabilityService
  ) { }

  ngOnInit() {

    this.dashboardAvailabilityService.availableDashboards.takeUntil(this.unsubscribe$).subscribe(dbTypes => {
      if (dbTypes.length) {
        this.activeDashboard = dbTypes[dbTypes.length - 1];
      } else {
        this.activeDashboard = null;
      }
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
