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
}
