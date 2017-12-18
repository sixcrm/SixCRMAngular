import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {UserSigningString} from "../models/user-signing-string.model";
import {
  createUserSigningStringMutation,
  deleteUserSigningStringMutation, updateUserSigningStringMutation,
  userSigningStringQuery,
  userSigningStringsListQuery
} from "../utils/queries/entities/user-signing-string.queries";

@Injectable()
export class UserSigningStringsService extends AbstractEntityService<UserSigningString> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new UserSigningString(data),
      userSigningStringsListQuery,
      userSigningStringQuery,
      deleteUserSigningStringMutation,
      createUserSigningStringMutation,
      updateUserSigningStringMutation,
      'user',
      snackBar
    );
  }

}
