import { Injectable } from '@angular/core';
import {NotificationSettings, NotificationSettingsData} from '../models/notification-settings.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  notificationSettingsQuery, defaultNotificationSettingsQuery,
  createNotificationSettingsMutation, updateNotificationSettingsMutation,
  sendTestNotification
} from '../utils/query-builder';
import {Subject} from 'rxjs';
import {NotificationsQuickService} from './notifications-quick.service';
import {HttpWrapperService, extractData} from './http-wrapper.service';

@Injectable()
export class NotificationSettingsService extends AbstractEntityService<NotificationSettings> {

  defaultNotificationSettings$: Subject<NotificationSettingsData> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, private notificationsQuickService: NotificationsQuickService) {
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
    this.queryRequest(defaultNotificationSettingsQuery()).subscribe(data => {
      let obj = extractData(data).notificationsettingdefault;

      this.defaultNotificationSettings$.next(new NotificationSettingsData(obj));
    })
  }

  sendTestNotification(): void {
    this.queryRequest(sendTestNotification()).subscribe(() =>
      this.notificationsQuickService.restartPoolingNotifications()
    )
  }
}
