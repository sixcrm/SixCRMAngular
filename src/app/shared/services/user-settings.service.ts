import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {UserSettings} from '../models/user-settings';
import { userSettingsQuery, updateUserSettingsMutation } from '../utils/query-builder';

@Injectable()
export class UserSettingsService extends AbstractEntityService<UserSettings> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new UserSettings(data),
      null,
      userSettingsQuery,
      null,
      null,
      updateUserSettingsMutation,
      'default'
    )
  }
}
