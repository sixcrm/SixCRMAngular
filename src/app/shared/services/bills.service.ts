import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {Bill} from '../models/bill.model';
import {
  billListQuery, billQuery, deleteBillMutation, createBillMutation,
  updateBillMutation
} from '../utils/queries/entities/bill.queries';

@Injectable()
export class BillsService extends AbstractEntityService<Bill> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Bill(data),
      billListQuery,
      billQuery,
      deleteBillMutation,
      createBillMutation,
      updateBillMutation,
      'bill',
      snackBar
    );
  }
}
