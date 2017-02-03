import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Customer} from '../models/customer.model';
import {customerQuery, customersInfoListQuery} from '../utils/query-builder';
import {Subject} from 'rxjs';

@Injectable()
export class CustomersService extends AbstractEntityService {

  customers$: Subject<Customer[]>;
  customer$: Subject<Customer>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.customers$ = new Subject<Customer[]>();
    this.customer$ = new Subject<Customer>();
  }

  getCustomers(): void {
    this.queryRequest(customersInfoListQuery()).subscribe(
      (data) => {
        let customerData = data.json().data.customerlist.customers;
        this.customers$.next(customerData.map(customer => new Customer(customer)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCustomer(id: string): void {
    this.queryRequest(customerQuery(id)).subscribe(
      (data) => {
        let customerData = data.json().data.customer;
        this.customer$.next(new Customer(customerData));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
