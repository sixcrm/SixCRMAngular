import { Injectable } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TransactionsService } from '../../entity-services/services/transactions.service';
import { DashboardType } from './dashboard-type';
import { utc } from 'moment';

@Injectable()
export class DashboardAvailabilityService {

  public availableDashboards: BehaviorSubject<DashboardType[]> = new BehaviorSubject<DashboardType[]>([]);

  private fullSub: Subscription;
  private lowSub: Subscription;

  constructor(
    private authService: AuthenticationService,
    private transactionService: TransactionsService
  ) {

    this.authService.activeAcl$.subscribe((acl) => {
      if (acl && acl.id) {
        this.determineAvailableTypes();
      }
    });
  }

  determineAvailableTypes() {
    if (this.fullSub) {
      this.fullSub.unsubscribe();
    }

    if (this.lowSub) {
      this.lowSub.unsubscribe();
    }

    this.checkDashboards();
  }

  checkDashboards() {
    this.fullSub = this.transactionService.haveEntitiesBefore(utc().subtract(7, 'd')).subscribe((hasOld: boolean) => {

      if (hasOld) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data, DashboardType.full]);
      } else {
        this.checkIfAny();
      }

    });
  }

  checkIfAny() {
    this.lowSub = this.transactionService.haveAnyEntities().subscribe((hasAny: boolean) => {
      if (hasAny) {
        this.availableDashboards.next([DashboardType.setup, DashboardType.low_data]);
      } else {
        this.availableDashboards.next([DashboardType.setup]);
      }
    })
  }

}
