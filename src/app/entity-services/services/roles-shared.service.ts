import { Injectable } from '@angular/core';
import {Role} from '../../shared/models/role.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {rolesSharedListQuery, roleSharedQuery, createRoleMutation} from '../../shared/utils/queries/entities/role.queries';
import {MatSnackBar} from '@angular/material';
import {firstIndexOf} from '../../shared/utils/array.utils';

@Injectable()
export class RolesSharedService extends AbstractEntityService<Role>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'role',
      snackBar
    );
  }

  isRoleAvailable(role: Role): boolean {
    const noPermissionId = '6341d12d-4c36-4717-bf6d-1d0cbebe63d8';
    const disabledId = '78e507dd-93fc-413b-b21a-819480209740';
    const customerId = '3f4b642d-1eb7-4924-91d2-85db155ce943';

    return !(role.id === noPermissionId || role.id === disabledId || role.id === customerId);
  }

}
