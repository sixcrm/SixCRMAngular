import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Rebill} from '../models/rebill.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  rebillsListQuery, rebillQuery, deleteRebillMutation,
  updateRebillMutation, deleteRebillsMutation
} from '../utils/queries/entities/rebill.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class RebillsService extends AbstractEntityService<Rebill>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Rebill(data),
      rebillsListQuery,
      rebillQuery,
      deleteRebillMutation,
      deleteRebillsMutation,
      null,
      updateRebillMutation,
      null,
      'rebill',
      snackBar
    )
  }

}
