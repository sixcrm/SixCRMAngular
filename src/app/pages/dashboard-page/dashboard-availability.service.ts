import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TransactionsService } from '../../shared/services/transactions.service';
import { DashboardType } from './dashboard-type';
import { CustomServerError } from '../../shared/models/errors/custom-server-error';
import { FailStrategy } from '../../shared/services/http-wrapper.service';
import { Transaction } from '../../shared/models/transaction.model';
import { utc } from 'moment';

@Injectable()
export class DashboardAvailabilityService {

  public availableDashboards: BehaviorSubject<DashboardType[]> = new BehaviorSubject<DashboardType[]>([]);
  private sevenDaysAgo = utc().subtract(7, 'd');
  private eightDaysAgo = utc().subtract(8, 'd');

  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionsService
  ) {

    this.authService.activeAcl$.subscribe(() => {
      this.determineAvailableTypes();
    });
  }

  determineAvailableTypes() {
    this.transactionService.entities$.take(1).subscribe((response: Transaction[] | CustomServerError) => {

      this.availableDashboards.next([DashboardType.setup]);
      if (response instanceof CustomServerError) {
        return;
      }

      if (response.length > 0) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data]);
      }

      let olderThan7Days = transaction => transaction.createdAt.isBefore(this.sevenDaysAgo);
      let olderTrasactions = response.filter(olderThan7Days);

      if (olderTrasactions.length > 0 || response.length > 10) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data, DashboardType.full]);
      }

    });

    this.transactionService.transactionsUntil(this.eightDaysAgo);
  }

}
