import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {UserSettings} from '../models/user-settings';
import {
  userSettingsQuery, updateUserSettingsMutation, defaultNotificationSettingsQuery,
  notificationSettingsQuery
} from '../utils/query-builder';
import {NotificationSettingsData, NotificationSettings} from '../models/notification-settings.model';
import {Subject} from 'rxjs';

@Injectable()
export class UserSettingsService extends AbstractEntityService<UserSettings> {

  defaultNotificationSettings$: Subject<NotificationSettingsData> = new Subject();
  notificationSettings$: Subject<NotificationSettings> = new Subject();

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

  fetchDefaultNotificationSettings(): void {
    this.queryRequest(defaultNotificationSettingsQuery()).subscribe(
      (data) => {
        let obj = data.json().data.notificationsettingdefault;

        this.defaultNotificationSettings$.next(new NotificationSettingsData(obj));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  fetchNotificationSettings(id: string): void {
    this.queryRequest(notificationSettingsQuery(id)).subscribe(
      (data) => {
        let obj = data.json().data.notificationsetting;

        this.notificationSettings$.next(new NotificationSettings(obj));
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
