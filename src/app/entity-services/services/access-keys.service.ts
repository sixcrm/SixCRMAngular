import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccessKey} from '../../shared/models/access-key.model';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  accessKeyQuery, deleteAccessKeyMutation,
  accessKeysListQuery, createAccessKeyMutation, updateAccessKeyMutation, deleteAccessKeysMutation
} from '../../shared/utils/queries/entities/access-key.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AccessKeysService extends AbstractEntityService<AccessKey> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new AccessKey(data),
      accessKeysListQuery,
      accessKeyQuery,
      deleteAccessKeyMutation,
      deleteAccessKeysMutation,
      createAccessKeyMutation,
      updateAccessKeyMutation,
      null,
      'accesskey',
      snackBar
    );
  }

}
