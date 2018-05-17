import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TransactionsService } from '../../shared/services/transactions.service';
import { DashboardType } from './dashboard-type';
import { CustomServerError } from '../../shared/models/errors/custom-server-error';
import { FailStrategy } from '../../shared/services/http-wrapper.service';

@Injectable()
export class DashboardAvailabilityService {

  public availableDashboards: BehaviorSubject<DashboardType[]> = new BehaviorSubject<DashboardType[]>([]);

  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionsService
  ) {

    this.authService.activeAcl$.subscribe(() => {
      this.determineAvailableTypes();
    });
  }

  determineAvailableTypes() {
    this.transactionService.entities$.take(1).subscribe((response) => {

      if (response instanceof CustomServerError) {
        this.availableDashboards.next([DashboardType.setup]);

        return;
      }

      if (response.length > 0) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.full]);
      }

      if (!response || response.length === 0) {
        this.availableDashboards.next([DashboardType.setup]);
      }

    });

    this.transactionService.getEntities(1, null, {failStrategy: FailStrategy.Soft});
  }

}
