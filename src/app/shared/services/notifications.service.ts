import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Notification} from './../models/notification.model'
import {Subject, Observable, Subscription} from 'rxjs';
import {notificationCountQuery, notificationsListQuery} from '../utils/query-builder';

@Injectable()
export class NotificationsService extends AbstractEntityService<Notification> {

  notificationCount$: Subject<number> = new Subject<number>();
  poolingInterval = 30000;
  notificationsSub: Subscription;

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Notification(data),
      notificationsListQuery,
      null,
      null,
      null,
      null,
      'default'
    );
  }

  startPoolingNotifications(): void {
    this.notificationsSub = Observable.interval(this.poolingInterval).takeWhile(() => this.authService.authenticated()).subscribe(() => {
      this.getNotificationCount();
    })
  }

  restartPoolingNotifications(): void {
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }

    this.startPoolingNotifications();
  }

  getNotificationCount(): void {
    if (!this.authService.authenticated()) {
      return;
    }

    this.queryRequest(notificationCountQuery()).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.notificationCount$.next(entityData.count);
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
