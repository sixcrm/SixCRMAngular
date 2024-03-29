import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Rebill} from '../../shared/models/rebill.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  rebillsListQuery, rebillQuery, deleteRebillMutation,
  updateRebillMutation, deleteRebillsMutation, pendingRebillsByCustomer, rebillWithFullSessionQuery
} from '../../shared/utils/queries/entities/rebill.queries';
import {MatSnackBar} from '@angular/material';
import {Customer} from '../../shared/models/customer.model';
import {IndexQueryParameters} from '../../shared/utils/queries/index-query-parameters.model';
import {Observable} from 'rxjs';

@Injectable()
export class RebillsService extends AbstractEntityService<Rebill>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Rebill(data),
      rebillsListQuery,
      rebillQuery,
      deleteRebillMutation,
      deleteRebillsMutation,
      null,
      updateRebillMutation,
      null,
      'rebill',
      snackBar
    )
  }

  getPendingRebillsByCustomer(customerId: string, params: IndexQueryParameters): Observable<Rebill[]> {
    return this.planeCustomEntitiesQuery(pendingRebillsByCustomer(customerId, params));
  }

  getRebillWithFullSessionDetails(rebillId: string): void {
    return this.customEntityQuery(rebillWithFullSessionQuery(rebillId));
  }
}
