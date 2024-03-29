import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Customer} from '../../shared/models/customer.model';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  customersInfoListQuery, customerQuery,
  deleteCustomerMutation, createCustomerMutation, updateCustomerMutation, deleteCustomersMutation
} from '../../shared/utils/queries/entities/customer.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class CustomersService extends AbstractEntityService<Customer> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Customer(data),
      customersInfoListQuery,
      customerQuery,
      deleteCustomerMutation,
      deleteCustomersMutation,
      createCustomerMutation,
      updateCustomerMutation,
      null,
      'customer',
      snackBar
    );
  }
}
