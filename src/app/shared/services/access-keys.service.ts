import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccessKey} from '../models/access-key.model';
import {accessKeysListQuery, accessKeyQuery, deleteAccessKeyMutation} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';

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
      null,
      null,
      'accesskey',
      snackBar
    );
  }

}
