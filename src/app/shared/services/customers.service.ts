import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Customer} from '../models/customer.model';
import {HttpWrapperService} from './http-wrapper.service';
import {
  customersInfoListQuery, customerQuery,
  deleteCustomerMutation, createCustomerMutation, updateCustomerMutation, deleteCustomersMutation
} from '../utils/queries/entities/customer.queries';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class CustomersService extends AbstractEntityService<Customer> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
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
      'customer',
      snackBar
    );
  }
}
