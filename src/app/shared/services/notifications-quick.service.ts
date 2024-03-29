import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {AbstractEntityService} from '../../entity-services/services/abstract-entity.service';
import {Notification} from '../models/notification.model';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  notificationsQuickListQuery, updateNotificationMutation,
  notificationCountQuery, alertsListQuery, notificationsPersistentListQuery, updateManyNotificationsMutationQuery
} from '../utils/queries/entities/notification.queries';
import {CustomServerError} from '../models/errors/custom-server-error';
import {TranslationService} from '../../translation/translation.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class NotificationsQuickService extends AbstractEntityService<Notification> {

  notificationCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  alerts$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  notificationsPersistent$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  poolingInterval = 120000;
  notificationsSub: Subscription;
  countSub: Subscription;
  alertSub: Subscription;

  private hiddenNotifications: string = 'hidden_notifications';

  constructor(
    http: HttpWrapperService,
    authService: AuthenticationService,
    snackBar: MatSnackBar,
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
      updateManyNotificationsMutationQuery,
      'default',
      snackBar
    );

    this.toEntity = this.buildNotificationWithBody;
  }

  public buildNotificationWithBody(data) {
    let n = new Notification(data);
    n.body = this.translationService.translateNotificationBody(n);
    n.title = this.translationService.translateNotificationTitle(n);

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

  restartPoolingNotifications(timeout?: number): void {
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }

    if (this.countSub) {
      this.countSub.unsubscribe();
    }

    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }

    setTimeout(() => this.startPoolingNotifications(), timeout || 1);
  }

  getNotificationCount(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.countSub = this.queryRequest(notificationCountQuery(), {ignoreProgress: true, ignoreSnack: true}).subscribe(data => {
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

    this.alertSub = this.queryRequest(alertsListQuery(), {ignoreProgress: true, ignoreSnack: true}).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      let alerts = extractData(data).notificationlistbytype.notifications;

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

    this.queryRequest(notificationsPersistentListQuery(), {ignoreProgress: true, ignoreSnack: true}).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      let alerts = extractData(data).notificationlistbytype.notifications;

      if (alerts) {
        this.notificationsPersistent$.next(alerts.map(alert => this.buildNotificationWithBody(alert)));
      } else {
        this.notificationsPersistent$.next([]);
      }
    })
  }

  getHiddenNotificationIDs(): string[] {
    const hidden = localStorage.getItem(this.hiddenNotifications);
    let parsed = [];
    if (hidden) {
      parsed = JSON.parse(hidden).notifications;
    }

    return parsed;
  }

  setHiddenNotificationsIDs(ids: string[]): void {
    localStorage.setItem(this.hiddenNotifications, JSON.stringify({notifications: ids}));
  }

  removeHiddenNotificationsIDs(): void {
    localStorage.removeItem(this.hiddenNotifications);
  }
}
