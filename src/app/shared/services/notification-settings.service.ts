import { Injectable } from '@angular/core';
import {NotificationSettings, NotificationSettingsData} from '../models/notification-settings.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {NotificationsQuickService} from './notifications-quick.service';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  notificationSettingsQuery, createNotificationSettingsMutation,
  updateNotificationSettingsMutation, defaultNotificationSettingsQuery, sendTestNotification, sendTestAlert
} from '../utils/query-builder';
import {CustomServerError} from '../models/errors/custom-server-error';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class NotificationSettingsService extends AbstractEntityService<NotificationSettings> {

  defaultNotificationSettings$: Subject<NotificationSettingsData | CustomServerError> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, private notificationsQuickService: NotificationsQuickService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new NotificationSettings(data),
      null,
      notificationSettingsQuery,
      null,
      null,
      createNotificationSettingsMutation,
      updateNotificationSettingsMutation,
      'default',
      snackBar
    )
  }

  fetchDefaultNotificationSettings(): void {
    this.queryRequest(defaultNotificationSettingsQuery()).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.defaultNotificationSettings$.next(data);
        return;
      }

      const obj = extractData(data).notificationsettingdefault;

      this.defaultNotificationSettings$.next(new NotificationSettingsData(obj));
    })
  }

  sendTestNotification(): void {
    this.queryRequest(sendTestNotification()).subscribe(() =>
      this.notificationsQuickService.restartPoolingNotifications()
    )
  }

  sendTestAlert(): void {
    this.queryRequest(sendTestAlert()).subscribe(() =>
      this.notificationsQuickService.restartPoolingNotifications()
    )
  }
}
