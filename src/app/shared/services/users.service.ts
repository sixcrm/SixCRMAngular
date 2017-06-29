import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../models/user.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject} from 'rxjs';
import {Role} from '../models/role.model';
import {
  usersListQuery, userQuery, deleteUserMutation,
  updateUserMutation, inviteUserMutation
} from '../utils/queries/entities/user.queries';
import {HttpWrapperService} from './http-wrapper.service';

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
      null,
      updateUserMutation,
      'user'
    )
  }

  sendUserInvite(email: string, role: Role): Observable<boolean> {
    let subject: Subject<boolean> = new Subject<boolean>();
    let accountId = this.authService.getActiveAcl().account.id;

    this.queryRequest(inviteUserMutation(email, accountId, role.id)).subscribe(
      () => {
        subject.next(true);
      },
      (error) => {
        subject.next(false);
        console.error(error);
      }
    );

    return subject;
  }

}
