import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {CustomerNote} from '../../shared/models/customer-note.model';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  deleteCustomerNoteMutation, createCustomerNoteMutation,
  deleteCustomerNotesMutation, customerNotesByCustomerQuery, updateCustomerNoteMutation
} from '../../shared/utils/queries/entities/customer-note.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class CustomerNotesService extends AbstractEntityService<CustomerNote> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new CustomerNote(data),
      null,
      null,
      deleteCustomerNoteMutation,
      deleteCustomerNotesMutation,
      createCustomerNoteMutation,
      updateCustomerNoteMutation,
      null,
      'default',
      snackBar
    );
  }
}
