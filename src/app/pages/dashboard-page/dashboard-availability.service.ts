import { Injectable } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TransactionsService } from '../../entity-services/services/transactions.service';
import { DashboardType } from './dashboard-type';
import { Transaction } from '../../shared/models/transaction.model';
import { utc } from 'moment';

@Injectable()
export class DashboardAvailabilityService {

  public availableDashboards: BehaviorSubject<DashboardType[]> = new BehaviorSubject<DashboardType[]>([]);
  private sevenDaysAgo = utc().subtract(7, 'd');
  private eightDaysAgo = utc().subtract(8, 'd');

  private subscription: Subscription;

  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionsService
  ) {

    this.authService.activeAcl$.subscribe(() => {
      this.determineAvailableTypes();
    });
  }

  determineAvailableTypes() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.transactionService.getEntitiesForDashboardCheck().subscribe((response: Transaction[]) => {
      this.availableDashboards.next([DashboardType.setup]);

      if (response.length > 0) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data]);
      }

      let olderThan7Days = transaction => transaction.createdAt.isBefore(this.sevenDaysAgo);
      let olderTrasactions = response.filter(olderThan7Days);

      if (olderTrasactions.length > 0 || response.length > 10) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data, DashboardType.full]);
      }

    });

    this.transactionService.resetPagination();
    this.transactionService.transactionsUntil(this.eightDaysAgo);
  }

}
