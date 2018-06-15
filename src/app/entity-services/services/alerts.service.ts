import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Notification} from '../../shared/models/notification.model'
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  updateNotificationMutation, alertsListQuery,
  updateManyNotificationsMutationQuery
} from '../../shared/utils/queries/entities/notification.queries';
import {TranslationService} from '../../translation/translation.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AlertsService extends AbstractEntityService<Notification> {

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
      alertsListQuery,
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
      n.title = this.translationService.translateNotificationTitle(n);

      return n;
    }
  }
}
