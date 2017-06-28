import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Notification} from './../models/notification.model'
import {notificationsListQuery, updateNotificationMutation} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class NotificationsService extends AbstractEntityService<Notification> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
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
