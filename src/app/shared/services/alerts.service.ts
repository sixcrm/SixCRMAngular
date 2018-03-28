import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Notification} from './../models/notification.model'
import {HttpWrapperService} from './http-wrapper.service';
import { updateNotificationMutation, alertsListQuery } from '../utils/queries/entities/notification.queries';
import {MdSnackBar} from '@angular/material';
import {TranslationService} from '../../translation/translation.service';

@Injectable()
export class AlertsService extends AbstractEntityService<Notification> {

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
      alertsListQuery,
      null,
      null,
      null,
      null,
      updateNotificationMutation,
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
