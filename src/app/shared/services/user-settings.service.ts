import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {UserSettings} from '../models/user-settings';
import { userSettingsQuery, updateUserSettingsMutation } from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';

@Injectable()
export class UserSettingsService extends AbstractEntityService<UserSettings> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
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
    );

    this.entityUpdated$.subscribe(settings => {
      if (settings instanceof CustomServerError) return;

      this.authService.updateTimezone(settings.timezone)
    })
  }
}
