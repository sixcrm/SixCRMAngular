import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {AsyncSubject} from 'rxjs';
import { DashboardType } from './dashboard-type';
import { DashboardAvailabilityService } from './dashboard-availability.service';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public DashboardType: any = DashboardType;
  activeDashboard: DashboardType;
  availableDashboards: DashboardType[] = [];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private dashboardAvailabilityService: DashboardAvailabilityService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.dashboardAvailabilityService.availableDashboards.takeUntil(this.unsubscribe$).subscribe(dbTypes => {
      if (dbTypes.length) {
        this.activeDashboard = this.authService.getActiveDashboard();
        this.availableDashboards = dbTypes;
      }
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  saveActiveDashboard() {
    this.authService.setActiveDashboard(this.activeDashboard);
  }

  activeIndex(): number {
    return parseInt(this.activeDashboard.toString());
  }
}
