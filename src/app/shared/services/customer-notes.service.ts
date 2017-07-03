import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {CustomerNote} from '../models/customer-note.model';
import {HttpWrapperService} from './http-wrapper.service';
import {deleteCustomerNoteMutation, createCustomerNoteMutation} from '../utils/queries/entities/customer-note.queries';

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
