import { Injectable } from '@angular/core';
import {Session} from '../../shared/models/session.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  sessionsInfoListQuery, sessionQuery, deleteSessionMutation,
  deleteSessionsMutation, updateSessionMutation
} from '../../shared/utils/queries/entities/session.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class SessionsService extends AbstractEntityService<Session> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Session(data),
      sessionsInfoListQuery,
      sessionQuery,
      deleteSessionMutation,
      deleteSessionsMutation,
      null,
      updateSessionMutation,
      null,
      'session',
      snackBar
    );
  }
}
