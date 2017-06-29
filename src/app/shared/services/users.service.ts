import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../models/user.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable} from 'rxjs';
import {Role} from '../models/role.model';
import {
  usersListQuery, userQuery, deleteUserMutation,
  updateUserMutation, inviteUserMutation, createUserMutation
} from '../utils/queries/entities/user.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {Response} from '@angular/http'

@Injectable()
export class UsersService extends AbstractEntityService<User> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new User(data),
      usersListQuery,
      userQuery,
      deleteUserMutation,
      createUserMutation,
      updateUserMutation,
      'user'
    )
  }

  sendUserInvite(email: string, role: Role): Observable<Response> {
    let accountId = this.authService.getActiveAcl().account.id;
    return this.queryRequest(inviteUserMutation(email, accountId, role.id));
  }

}
