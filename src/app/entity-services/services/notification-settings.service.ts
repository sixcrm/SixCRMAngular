import { Injectable } from '@angular/core';
import {NotificationSettings, NotificationSettingsData} from '../../shared/models/notification-settings.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {HttpWrapperService, extractData} from '../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {
  notificationSettingsQuery, sendTestNotification, sendTestAlert,
  updateNotificationSettingsMutation, createNotificationSettingsMutation, defaultNotificationSettingsQuery
} from '../../shared/utils/queries/entities/notification-settings.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class NotificationSettingsService extends AbstractEntityService<NotificationSettings> {

  defaultNotificationSettings$: Subject<NotificationSettingsData | CustomServerError> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, private notificationsQuickService: NotificationsQuickService, snackBar: MatSnackBar) {
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
      null,
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
      this.notificationsQuickService.restartPoolingNotifications(500)
    )
  }

  sendTestAlert(): void {
    this.queryRequest(sendTestAlert()).subscribe(() =>
      this.notificationsQuickService.restartPoolingNotifications(500)
    )
  }

  createEntity(entity: NotificationSettings, options?: {ignoreSnack?: boolean}): void {
    let opts = options || {};
    opts.ignoreSnack = true;
    super.createEntity(entity, opts)
  }
}
