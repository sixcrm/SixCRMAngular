import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {AuthenticationService} from '../../authentication/authentication.service';
import { DashboardType } from './dashboard-type';
import { TransactionsService } from '../../shared/services/transactions.service';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public DashboardType: any = DashboardType;
  activeDashboard: DashboardType = DashboardType.setup;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionsService
  ) { }

  ngOnInit() {
    this.determineType();

    this.authService.activeAcl$.subscribe(() => {
      this.determineType();
    });

  }

  determineType() {
    this.transactionService.entities$.take(1).subscribe((response) => {

      if (response instanceof CustomServerError) return;

      if (response.length > 0) {
        this.activeDashboard = DashboardType.full;
      }

      if (!response || response.length === 0) {
        this.activeDashboard = DashboardType.setup;
      }

    });

    this.transactionService.getEntities(1);
  }
}
