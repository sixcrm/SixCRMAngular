import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {MatSnackBar} from '@angular/material';
import {Customer} from '../../shared/models/customer.model';
import {IndexQueryParameters} from '../../shared/utils/queries/index-query-parameters.model';
import {Observable} from 'rxjs';
import {Order} from '../../shared/models/order.model';
import {ordersByCustomer} from '../../shared/utils/queries/entities/order.queries';

@Injectable()
export class OrdersService extends AbstractEntityService<Order>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Order(data),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'rebill',
      snackBar
    )
  }

  getOrdersByCustomer(customer: Customer, params: IndexQueryParameters): Observable<Order[]> {
    return this.planeCustomEntitiesQuery(ordersByCustomer(customer.id, params));

  }

}
