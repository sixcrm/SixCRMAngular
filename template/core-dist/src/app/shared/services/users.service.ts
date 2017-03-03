import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {User} from '../models/user.model';
import {Http} from '@angular/http';
import {usersListQuery, userQuery, deleteUserMutation} from '../utils/query-builder';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class UsersService extends AbstractEntityService<User> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new User(data),
      usersListQuery,
      userQuery,
      deleteUserMutation
    )
  }

}
