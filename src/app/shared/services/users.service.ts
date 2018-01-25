import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../models/user.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable} from 'rxjs';
import {Role} from '../models/role.model';
import {
  usersListQuery, userQuery, deleteUserMutation,
  updateUserMutation, inviteUserMutation, createUserMutation, inviteResendMutation,
  latestTermsAndConditions
} from '../utils/queries/entities/user.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {Response} from '@angular/http'
import {MdSnackBar} from '@angular/material';
import {Acl} from '../models/acl.model';
import {CustomServerError} from '../models/errors/custom-server-error';

@Injectable()
export class UsersService extends AbstractEntityService<User> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new User(data),
      usersListQuery,
      userQuery,
      deleteUserMutation,
      createUserMutation,
      updateUserMutation,
      'user',
      snackBar
    );

    this.entityUpdated$.subscribe(user => {
      if (user instanceof CustomServerError || this.authService.getSixUser().id !== user.id) {
        return;
      }

      this.authService.updateSixUser(user);
    });
  }

  sendUserInvite(email: string, role: Role, accountId: string): Observable<Response> {
    return this.queryRequest(inviteUserMutation(email, accountId, role.id));
  }

  resendUserInvite(acl: Acl): Observable<Response> {
    return this.queryRequest(inviteResendMutation(acl));
  }

  updateUserForAcceptTermsAndConditions(user: User): Observable<Response> {
    return this.queryRequest(updateUserMutation(user), {ignoreTermsAndConditions: true});
  }

  getLatestTermsAndConditions(role?: string): Observable<Response> {
    return this.queryRequest(latestTermsAndConditions(role), {ignoreTermsAndConditions: true});
  }



}
