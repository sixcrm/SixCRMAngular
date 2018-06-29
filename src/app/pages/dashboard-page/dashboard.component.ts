import { Component, OnDestroy, OnInit } from '@angular/core';
import {AsyncSubject} from 'rxjs';
import { DashboardType } from './dashboard-type';
import { DashboardAvailabilityService } from './dashboard-availability.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { routerTransition } from '../../routing.animations';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit, OnDestroy {

  public transition: 'void' | '*' = '*';
  activeDashboard: DashboardType;
  availableDashboards: DashboardType[] = [];

  renderLow: boolean;
  renderFull: boolean;
  show: boolean;

  currentAclId: string;

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

    this.authService.activeAcl$.takeUntil(this.unsubscribe$).subscribe((acl: Acl) => {
      if (acl && acl.id !== this.currentAclId) {
        this.currentAclId = acl.id;

        this.redrawDashboards();

        this.retriggerScrollAnimation();
      }
    });
  }

  redrawDashboards() {
    this.renderFull = false;
    this.renderLow = false;

    this.setIndex(+this.authService.getActiveDashboard());
  }

  retriggerScrollAnimation() {
    this.show = false;
    setTimeout(() => this.show = true, 1);
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
