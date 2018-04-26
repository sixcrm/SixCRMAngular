import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {EventHook} from '../models/event-hook.model';
import {
  deleteEventHookMutation, deleteEventHooksMutation,
  createEventHookMutation, updateEventHookMutation, eventHookQuery, eventHooksListQuery
} from '../utils/queries/entities/event-hook.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class EventHooksService extends AbstractEntityService<EventHook> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new EventHook(data),
      eventHooksListQuery,
      eventHookQuery,
      deleteEventHookMutation,
      deleteEventHooksMutation,
      createEventHookMutation,
      updateEventHookMutation,
      null,
      'eventhook',
      snackBar
    );
  }
}
