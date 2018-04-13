import { Injectable } from '@angular/core';
import {Role} from '../models/role.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  rolesListQuery, roleQuery, deleteRoleMutation,
  deleteRolesMutation, updateRoleMutation, createRoleMutation
} from '../utils/queries/entities/role.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class RolesService extends AbstractEntityService<Role>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Role(data),
      rolesListQuery,
      roleQuery,
      deleteRoleMutation,
      deleteRolesMutation,
      createRoleMutation,
      updateRoleMutation,
      'role',
      snackBar
    );
  }

}
