import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {MatSnackBar} from '@angular/material';
import {Return} from '../../shared/models/return.model';
import {createReturnMutation} from '../../shared/utils/queries/entities/return.queries';

@Injectable()
export class ReturnsService extends AbstractEntityService<Return>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Return(data),
      null,
      null,
      null,
      null,
      createReturnMutation,
      null,
      null,
      'rebill',
      snackBar
    )
  }
}
