import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {Bill} from '../../shared/models/bill.model';
import {
  billListQuery, billQuery, deleteBillMutation, createBillMutation,
  updateBillMutation, deleteBillsMutation
} from '../../shared/utils/queries/entities/bill.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class BillsService extends AbstractEntityService<Bill> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Bill(data),
      billListQuery,
      billQuery,
      deleteBillMutation,
      deleteBillsMutation,
      createBillMutation,
      updateBillMutation,
      null,
      'bill',
      snackBar
    );
  }
}
