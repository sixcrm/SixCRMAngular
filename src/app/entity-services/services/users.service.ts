import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../../shared/models/user.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable} from 'rxjs';
import {Role} from '../../shared/models/role.model';
import {
  usersListQuery, userQuery, deleteUserMutation,
  updateUserMutation, inviteUserMutation, createUserMutation, inviteResendMutation,
  deleteUsersMutation, latestTermsAndConditions
} from '../../shared/utils/queries/entities/user.queries';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {HttpResponse} from '@angular/common/http'
import {Acl} from '../../shared/models/acl.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';

@Injectable()
export class UsersService extends AbstractEntityService<User> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new User(data),
      usersListQuery,
      userQuery,
      deleteUserMutation,
      deleteUsersMutation,
      createUserMutation,
      updateUserMutation,
      null,
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

  sendUserInvite(
    email: string,
    firstName: string,
    lastName: string,
    role: Role,
    accountId: string
  ): Observable<HttpResponse<any> | CustomServerError> {
    return this.queryRequest(inviteUserMutation(email, firstName, lastName, accountId, role.id));
  }

  resendUserInvite(acl: Acl): Observable<HttpResponse<any> | CustomServerError> {
    return this.queryRequest(inviteResendMutation(acl));
  }

  updateUserForAcceptTermsAndConditions(user: User): Observable<HttpResponse<any> | CustomServerError> {
    return this.queryRequest(updateUserMutation(user));
  }

  getlatestTermsAndConditions(accountId?: string, role?: string): Observable<HttpResponse<any> | CustomServerError> {
    return this.http.postWithError(environment.publicendpoint, latestTermsAndConditions(accountId, role), { })
      .map(response => {
        if (response instanceof CustomServerError) {
          return response;
        }

        response.body.response.data.latesttermsandconditions.body =
          response.body.response.data.latesttermsandconditions.body.replace('https://sixcrm.com', '<a href="https://sixcrm.com" target="_blank">https://sixcrm.com</a>');

        return response;
      });
  }
}
