import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {EventHook} from '../models/event-hook.model';
import {
  deleteEventHookMutation, deleteEventHooksMutation,
  createEventHookMutation, updateEventHookMutation, eventHookQuery, eventHooksListQuery
} from '../utils/queries/entities/event-hook.queries';

@Injectable()
export class EventHooksService extends AbstractEntityService<EventHook> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
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
      'eventhook',
      snackBar
    );
  }
}
