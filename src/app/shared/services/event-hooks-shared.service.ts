import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {EventHook} from '../models/event-hook.model';
import {createEventHookMutation, eventHooksSharedListQuery,eventHookSharedQuery} from '../utils/queries/entities/event-hook.queries';
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
