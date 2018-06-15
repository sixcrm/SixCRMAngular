import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {EventHook} from '../../shared/models/event-hook.model';
import {createEventHookMutation, eventHooksSharedListQuery,eventHookSharedQuery} from '../../shared/utils/queries/entities/event-hook.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class EventHooksSharedService extends AbstractEntityService<EventHook> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new EventHook(data),
      eventHooksSharedListQuery,
      eventHookSharedQuery,
      null,
      null,
      createEventHookMutation,
      null,
      null,
      'eventhook',
      snackBar
    );
  }
}
