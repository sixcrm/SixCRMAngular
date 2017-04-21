import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Notification} from './../models/notification.model'
import {notificationsListQuery, updateNotificationMutation} from '../utils/query-builder';

@Injectable()
export class NotificationsService extends AbstractEntityService<Notification> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Notification(data),
      notificationsListQuery,
      null,
      null,
      null,
      updateNotificationMutation,
      'default'
    );
  }
}
