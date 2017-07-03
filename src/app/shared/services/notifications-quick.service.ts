import { Injectable } from '@angular/core';
import {
  updateNotificationMutation, notificationCountQuery, notificationsQuickListQuery
} from '../utils/query-builder';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject, Subscription, Observable} from 'rxjs';
import {AbstractEntityService} from './abstract-entity.service';
import {Notification} from '../models/notification.model';
import {HttpWrapperService, extractData} from './http-wrapper.service';

@Injectable()
export class NotificationsQuickService extends AbstractEntityService<Notification> {

  notificationCount$: Subject<number> = new Subject<number>();
  poolingInterval = 30000;
  notificationsSub: Subscription;
  querySub: Subscription;

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Notification(data),
      notificationsQuickListQuery,
      null,
      null,
      null,
      updateNotificationMutation,
      'default'
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
