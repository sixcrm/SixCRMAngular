import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccessKey} from '../models/access-key.model';
import {accessKeysListQuery, accessKeyQuery, deleteAccessKeyMutation} from '../utils/query-builder';

@Injectable()
export class AccessKeysService extends AbstractEntityService<AccessKey> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new AccessKey(data),
      accessKeysListQuery,
      accessKeyQuery,
      deleteAccessKeyMutation
    );
  }

}
