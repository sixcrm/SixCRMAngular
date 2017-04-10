import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {CustomerNote} from '../models/customer-note.model';
import {
  customerNotesByCustomerQuery, createCustomerNoteMutation, deleteCustomerNoteMutation
} from '../utils/query-builder';

@Injectable()
export class CustomerNotesService extends AbstractEntityService<CustomerNote> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new CustomerNote(data),
      null,
      null,
      deleteCustomerNoteMutation,
      createCustomerNoteMutation,
      null,
      'customer'
    );
  }

  getByCustomer(id: string): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.queryRequest(customerNotesByCustomerQuery(id)).subscribe(
      (data) => {
        let json = data.json().data;
        let listKey = Object.keys(json)[0];
        let listData = json[listKey];

        let entitiesKey = Object.keys(listData)[0];
        let entitiesData = listData[entitiesKey];

        if (entitiesData) {
          this.entities$.next(entitiesData.map(entity => new CustomerNote(entity)));
        } else {
          this.entities$.next([]);
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
