import { Injectable } from '@angular/core';
import {NotificationSettings, NotificationSettingsData} from '../models/notification-settings.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {
  notificationSettingsQuery, defaultNotificationSettingsQuery,
  createNotificationSettingsMutation, updateNotificationSettingsMutation
} from '../utils/query-builder';
import {Subject} from 'rxjs';

@Injectable()
export class NotificationSettingsService extends AbstractEntityService<NotificationSettings> {

  defaultNotificationSettings$: Subject<NotificationSettingsData> = new Subject();

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new NotificationSettings(data),
      null,
      notificationSettingsQuery,
      null,
      createNotificationSettingsMutation,
      updateNotificationSettingsMutation,
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

}
