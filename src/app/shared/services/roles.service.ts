import { Injectable } from '@angular/core';
import {Role} from '../models/role.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {rolesListQuery, roleQuery} from '../utils/queries/entities/role.queries';

@Injectable()
export class RolesService extends AbstractEntityService<Role>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Role(data),
      rolesListQuery,
      roleQuery,
      null,
      null,
      null,
      null,
      'role',
      snackBar
    );
  }

}
