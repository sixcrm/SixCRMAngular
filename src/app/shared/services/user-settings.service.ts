import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {UserSettings} from '../models/user-settings';
import {HttpWrapperService} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';
import {ColumnParams} from '../models/column-params.model';
import {userSettingsQuery, updateUserSettingsMutation} from '../utils/queries/entities/user-settings.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UserSettingsService extends AbstractEntityService<UserSettings> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new UserSettings(data),
      null,
      userSettingsQuery,
      null,
      null,
      null,
      updateUserSettingsMutation,
      null,
      'default',
      snackBar
    );

    this.entityUpdated$.subscribe(settings => {
      if (settings instanceof CustomServerError) return;

      this.authService.updateSettings(settings);
      this.authService.updateTimezone(settings.timezone)
    });
  }

  updateColumnPreferences(columnParams: ColumnParams<any>[]) {
    this.entity$.take(1).subscribe(userSettings => {
      if (userSettings instanceof CustomServerError) return;

      userSettings.updatePreferencesByColumnParams(columnParams);

      this.updateEntity(userSettings);
    });

    this.getEntity(this.authService.getSixUser().id);
  }
}
