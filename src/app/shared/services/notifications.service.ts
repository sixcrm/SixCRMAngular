import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Notification} from './../models/notification.model'
import { HttpWrapperService, RequestBehaviourOptions } from './http-wrapper.service';
import {
  notificationsListQuery,
  updateManyNotificationsMutationQuery,
  updateNotificationMutation
} from '../utils/queries/entities/notification.queries';
import {TranslationService} from '../../translation/translation.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class NotificationsService extends AbstractEntityService<Notification> {

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
      notificationsListQuery,
      null,
      null,
      null,
      null,
      updateNotificationMutation,
      updateManyNotificationsMutationQuery,
      'default',
      snackBar
    );

    this.toEntity = (data) => {
      let n = new Notification(data);
      n.body = this.translationService.translateNotificationBody(n);

      return n;
    }
  }
}
