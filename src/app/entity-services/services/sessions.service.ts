import { Injectable } from '@angular/core';
import {Session} from '../../shared/models/session.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService, extractData} from '../../shared/services/http-wrapper.service';
import {
  sessionsInfoListQuery, sessionQuery, deleteSessionMutation,
  deleteSessionsMutation, updateSessionMutation, cancelSessionMutation, confirmDelivery
} from '../../shared/utils/queries/entities/session.queries';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

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

  cancelSession(session: Session): Observable<Session | CustomServerError> {
    if (!this.hasWritePermission()) {
      return;
    }

    return this.queryRequest(cancelSessionMutation(session, this.authService.getSixUser().id)).map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      this.openSnackBar('Session Canceled!');

      return new Session(extractData(data).cancelsession);
    });
  }

  confirmDelivery(sessionId: string): Observable<any | CustomServerError> {
    if (!this.hasWritePermission()) {
      return;
    }

    return this.queryRequest(confirmDelivery(sessionId));
  }
}
