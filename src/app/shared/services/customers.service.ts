import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Customer} from '../models/customer.model';
import {
  customerQuery,
  customersInfoListQuery,
  deleteCustomerMutation,
  updateCustomerMutation,
  createCustomerMutation
} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class CustomersService extends AbstractEntityService<Customer> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Customer(data),
      customersInfoListQuery,
      customerQuery,
      deleteCustomerMutation,
      createCustomerMutation,
      updateCustomerMutation,
      'customer'
    );
  }
}
