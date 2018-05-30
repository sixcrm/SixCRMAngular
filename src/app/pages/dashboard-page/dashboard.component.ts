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

  renderLow: boolean;
  renderFull: boolean;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private dashboardAvailabilityService: DashboardAvailabilityService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.dashboardAvailabilityService.availableDashboards.takeUntil(this.unsubscribe$).subscribe(dbTypes => {
      if (dbTypes.length) {
        this.setIndex(+this.authService.getActiveDashboard());
        this.availableDashboards = dbTypes;
      }
    });

    this.authService.activeAcl$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.setIndex(+this.authService.getActiveDashboard());
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number) {
    this.activeDashboard = index;

    if (index === 1 && !this.renderLow) {
      setTimeout(() => this.renderLow = true, 200)
    }

    if (index === 2 && !this.renderFull) {
      setTimeout(() => this.renderFull = true, 200)
    }

    this.saveActiveDashboard();
  }

  saveActiveDashboard() {
    this.authService.setActiveDashboard(this.activeDashboard);
  }
}
