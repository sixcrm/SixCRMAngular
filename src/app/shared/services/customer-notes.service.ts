import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {CustomerNote} from '../models/customer-note.model';
import {createCustomerNoteMutation, deleteCustomerNoteMutation} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class CustomerNotesService extends AbstractEntityService<CustomerNote> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
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
