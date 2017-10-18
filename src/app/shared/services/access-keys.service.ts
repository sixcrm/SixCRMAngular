import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccessKey} from '../models/access-key.model';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {
  accessKeyQuery, deleteAccessKeyMutation,
  accessKeysListQuery, createAccessKeyMutation, updateAccessKeyMutation
} from '../utils/queries/entities/access-key.queries';

@Injectable()
export class AccessKeysService extends AbstractEntityService<AccessKey> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new AccessKey(data),
      accessKeysListQuery,
      accessKeyQuery,
      deleteAccessKeyMutation,
      createAccessKeyMutation,
      updateAccessKeyMutation,
      'accesskey',
      snackBar
    );
  }

}
