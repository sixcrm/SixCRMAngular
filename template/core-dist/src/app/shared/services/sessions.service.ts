import { Injectable } from '@angular/core';
import {Session} from '../models/session.model';
import {Subject} from 'rxjs';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {sessionsInfoListQuery, sessionQuery} from '../utils/query-builder';

@Injectable()
export class SessionsService extends AbstractEntityService {

  sessions$: Subject<Session[]>;
  session$: Subject<Session>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);

    this.sessions$ = new Subject<Session[]>();
    this.session$ = new Subject<Session>();
  }

  getSessions(): void {
    this.queryRequest(sessionsInfoListQuery()).subscribe(
      (data) => {
        let sessionsData = data.json().data.sessionlist.sessions;
        this.sessions$.next(sessionsData.map(session => new Session(session)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getSession(id: string): void {
    this.queryRequest(sessionQuery(id)).subscribe(
      (data) => {
        let sessionData = data.json().data.session;
        this.session$.next(new Session(sessionData));
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
