import { Injectable } from '@angular/core';
import {Role} from '../models/role.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {rolesSharedListQuery, roleSharedQuery, createRoleMutation} from '../utils/queries/entities/role.queries';

@Injectable()
export class RolesSharedService extends AbstractEntityService<Role>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Role(data),
      rolesSharedListQuery,
      roleSharedQuery,
      null,
      null,
      createRoleMutation,
      null,
      'role',
      snackBar
    );
  }

}
