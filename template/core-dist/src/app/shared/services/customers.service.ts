import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Customer} from '../models/customer.model';
import {customerQuery, customersInfoListQuery, deleteCustomerMutation} from '../utils/query-builder';

@Injectable()
export class CustomersService extends AbstractEntityService<Customer> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Customer(data),
      customersInfoListQuery,
      customerQuery,
      deleteCustomerMutation
    );
  }
}
