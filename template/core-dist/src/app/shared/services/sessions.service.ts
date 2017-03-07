import { Injectable } from '@angular/core';
import {Session} from '../models/session.model';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {sessionsInfoListQuery, sessionQuery, deleteSessionMutation} from '../utils/query-builder';

@Injectable()
export class SessionsService extends AbstractEntityService<Session> {

  constructor(http: Http, authService: AuthenticationService) {
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
