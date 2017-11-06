import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {CustomServerError} from '../models/errors/custom-server-error';
import {Router} from '@angular/router';
import {SnackbarService} from './snackbar.service';
import {TermsAndConditionsControllerService} from './terms-and-conditions-controller.service';

export enum FailStrategy {
  Ignore, Hard, Soft
}

export interface RequestBehaviourOptions {
  ignoreProgress?: boolean;
  ignoreTermsAndConditions?: boolean;
  failStrategy?: FailStrategy;
}

@Injectable()
export class HttpWrapperService {

  requestInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  numberOfWaitingRequests = 0;

  constructor(
    private http: Http,
    private snackbarService: SnackbarService,
    private router: Router,
    private tacService: TermsAndConditionsControllerService
  ) { }

  post(url: string, body: any, requestOptions: RequestOptionsArgs, requestBehaviourOptions?: RequestBehaviourOptions): Observable<Response> {
    const response: Subject<Response> = new Subject();

    if ((!requestBehaviourOptions || !requestBehaviourOptions.ignoreTermsAndConditions) && this.tacService.isTermsAndConditionsOutdated) {
      return response;
    }

    const ignoreProgress: boolean = requestBehaviourOptions && requestBehaviourOptions.ignoreProgress;
    const failStrategy: FailStrategy = requestBehaviourOptions ? requestBehaviourOptions.failStrategy : FailStrategy.Ignore;

    if (!ignoreProgress) this.setInProgress();

    this.http.post(url, body, requestOptions).subscribe(
      r => {
        if (!ignoreProgress) this.setNotInProgress();

        response.next(r);
        response.complete();
      },
      error => {
        // handle error
        if (!ignoreProgress) this.setNotInProgress();

        this.handleError(error);

        if (failStrategy === FailStrategy.Hard) {
          this.router.navigateByUrl('/error');
        }

        response.complete();
      }
    );

    return response;
  }

  postWithError(url: string, body: any, requestOptions: RequestOptionsArgs, requestBehaviourOptions?: RequestBehaviourOptions): Observable<Response | CustomServerError> {
    const response: Subject<Response | CustomServerError> = new Subject();

    if ((!requestBehaviourOptions || !requestBehaviourOptions.ignoreTermsAndConditions) && this.tacService.isTermsAndConditionsOutdated) {
      return response;
    }

    const ignoreProgress: boolean = requestBehaviourOptions && requestBehaviourOptions.ignoreProgress;
    const failStrategy: FailStrategy = requestBehaviourOptions ? requestBehaviourOptions.failStrategy : FailStrategy.Ignore;

    if (!ignoreProgress) this.setInProgress();

    this.http.post(url, body, requestOptions).subscribe(
      r => {
        if (!ignoreProgress) this.setNotInProgress();

        response.next(r);
        response.complete();
      },
      error => {
        // handle error
        if (!ignoreProgress) this.setNotInProgress();

        this.handleError(error);

        if (failStrategy === FailStrategy.Hard) {
          this.router.navigateByUrl('/error');
        }

        if (failStrategy === FailStrategy.Soft) {
          response.next(new CustomServerError(error.message));
        }

        response.complete();
      }
    );

    return response;
  }

  handleError(error) {
    if (!error.json().message) return;

    const duration = error.json().code === 403 ? 6000 : 3000;
    this.snackbarService.showErrorSnack(error.json().message, duration);
  }

  setInProgress() {
    if (this.numberOfWaitingRequests++ === 0) {
      setTimeout(() => this.requestInProgress$.next(true), 1)
    }
  }

  setNotInProgress() {
    if (this.numberOfWaitingRequests === 0) return;

    if (this.numberOfWaitingRequests-- === 1) {
      setTimeout(() => this.requestInProgress$.next(false), 1)
    }
  }
}

export function extractData(response: Response) {
  return response.json().response.data;
}

export function generateHeaders(token: string, contentType?: string): Headers {
  let headers = new Headers();
  headers.append('Content-Type', contentType ? contentType : 'application/json');
  headers.append('Authorization', token);

  return headers;
}
