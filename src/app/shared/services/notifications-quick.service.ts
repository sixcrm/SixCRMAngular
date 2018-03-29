import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {AbstractEntityService} from './abstract-entity.service';
import {Notification} from '../models/notification.model';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  notificationsQuickListQuery, updateNotificationMutation,
  notificationCountQuery, alertsListQuery, notificationsPersistentListQuery
} from '../utils/queries/entities/notification.queries';
import {CustomServerError} from '../models/errors/custom-server-error';
import {MdSnackBar} from '@angular/material';
import {TranslationService} from '../../translation/translation.service';

@Injectable()
export class NotificationsQuickService extends AbstractEntityService<Notification> {

  notificationCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  alerts$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  notificationsPersistent$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  poolingInterval = 60000;
  notificationsSub: Subscription;
  countSub: Subscription;
  alertSub: Subscription;

  constructor(
    http: HttpWrapperService,
    authService: AuthenticationService,
    snackBar: MdSnackBar,
    private translationService: TranslationService
  ) {
    super(
      http,
      authService,
      data => new Notification(data),
      notificationsQuickListQuery,
      null,
      null,
      null,
      null,
      updateNotificationMutation,
      'default',
      snackBar
    );

    this.toEntity = this.buildNotificationWithBody;
  }

  private buildNotificationWithBody(data) {
    let n = new Notification(data);
    n.body = this.translationService.translateNotificationBody(n);

    return n;
  }

  startPoolingNotifications(): void {
    this.notificationsSub =
      Observable
        .interval(this.poolingInterval)
        .takeWhile(() => this.authService.authenticated())
        .subscribe(() => {
          this.getNotificationCount();
          this.getAlerts();
        });

    this.getNotificationCount();
    this.getAlerts();
  }

  restartPoolingNotifications(): void {
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }

    if (this.countSub) {
      this.countSub.unsubscribe();
    }

    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }

    this.startPoolingNotifications();
  }

  getNotificationCount(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.countSub = this.queryRequest(notificationCountQuery(), {ignoreProgress: true}).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.notificationCount$.next(0);
        return;
      }

      let json = extractData(data);
      let entityKey = Object.keys(json)[0];
      let entityData =json[entityKey];

      if (!entityData || !entityData.count) {
        this.notificationCount$.next(0);
      } else {
        this.notificationCount$.next(entityData.count);
      }
    })
  }

  getAlerts(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.alertSub = this.queryRequest(alertsListQuery(), {ignoreProgress: true}).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      let alerts = extractData(data).notificationlistbytypes.notifications;

      if (alerts) {
        this.alerts$.next(alerts.map(alert => this.buildNotificationWithBody(alert)));
      } else {
        this.alerts$.next([]);
      }
    })
  }

  getPersistentNotifications(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.queryRequest(notificationsPersistentListQuery(), {ignoreProgress: true}).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      let alerts = extractData(data).notificationlistbytypes.notifications;

      if (alerts) {
        this.notificationsPersistent$.next(alerts.map(alert => this.buildNotificationWithBody(alert)));
      } else {
        this.notificationsPersistent$.next([]);
      }
    })
  }

}
