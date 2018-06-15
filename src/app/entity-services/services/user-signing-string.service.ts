import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {UserSigningString} from "../../shared/models/user-signing-string.model";
import {
  createUserSigningStringMutation,
  deleteUserSigningStringMutation, updateUserSigningStringMutation,
  userSigningStringQuery,
  userSigningStringsListQuery, deleteUserSigningStringsMutation
} from "../../shared/utils/queries/entities/user-signing-string.queries";
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UserSigningStringsService extends AbstractEntityService<UserSigningString> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new UserSigningString(data),
      userSigningStringsListQuery,
      userSigningStringQuery,
      deleteUserSigningStringMutation,
      deleteUserSigningStringsMutation,
      createUserSigningStringMutation,
      updateUserSigningStringMutation,
      null,
      'user',
      snackBar
    );
  }

}
