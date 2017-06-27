import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../models/user.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject} from 'rxjs';
import {Role} from '../models/role.model';
import {
  usersListQuery, userQuery, deleteUserMutation,
  updateUserMutation, inviteUserMutation
} from '../utils/queries/entities/user.queries';

@Injectable()
export class UsersService extends AbstractEntityService<User> {

  constructor(http: Http, authService: AuthenticationService) {
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
      (data) => {
        let info = data.json().data.userinvite;
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
