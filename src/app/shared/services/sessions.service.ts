import { Injectable } from '@angular/core';
import {Session} from '../models/session.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {sessionsInfoListQuery, sessionQuery, deleteSessionMutation} from '../utils/queries/entities/session.queries';

@Injectable()
export class SessionsService extends AbstractEntityService<Session> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Session(data),
      sessionsInfoListQuery,
      sessionQuery,
      deleteSessionMutation,
      null,
      null,
      'session'
    );
  }
}
