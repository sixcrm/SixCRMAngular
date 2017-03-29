import { Injectable } from '@angular/core';
import {Role} from '../models/role.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {rolesListQuery} from '../utils/query-builder';

@Injectable()
export class RolesService extends AbstractEntityService<Role>{

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Role(data),
      rolesListQuery,
      null,
      null,
      null,
      null,
      'role'
    );
  }

}
