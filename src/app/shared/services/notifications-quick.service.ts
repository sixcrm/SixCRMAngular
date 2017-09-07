import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject, Subscription, Observable} from 'rxjs';
import {AbstractEntityService} from './abstract-entity.service';
import {Notification} from '../models/notification.model';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  notificationsQuickListQuery, updateNotificationMutation,
  notificationCountQuery
} from '../utils/queries/entities/notification.queries';
import {CustomServerError} from '../models/errors/custom-server-error';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class NotificationsQuickService extends AbstractEntityService<Notification> {

  notificationCount$: Subject<number> = new Subject<number>();
  poolingInterval = 30000;
  notificationsSub: Subscription;
  querySub: Subscription;

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Notification(data),
      notificationsQuickListQuery,
      null,
      null,
      null,
      updateNotificationMutation,
      'default',
      snackBar
    );
  }

  startPoolingNotifications(): void {
    this.notificationsSub =
      Observable
        .interval(this.poolingInterval)
        .takeWhile(() => this.authService.authenticated())
        .subscribe(() => this.getNotificationCount());

    this.getNotificationCount();
  }

  restartPoolingNotifications(): void {
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }

    if (this.querySub) {
      this.querySub.unsubscribe();
    }

    this.startPoolingNotifications();
  }

  getNotificationCount(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.querySub = this.queryRequest(notificationCountQuery(), true).subscribe(data => {
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

}
