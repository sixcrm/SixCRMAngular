import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {CustomServerError} from '../models/errors/custom-server-error';
import {Router} from '@angular/router';
import {SnackbarService} from './snackbar.service';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

export enum FailStrategy {
  Ignore, Hard, Soft, HardStandalone
}

export interface RequestBehaviourOptions {
  ignoreProgress?: boolean;
  failStrategy?: FailStrategy;
  ignoreSnack?: boolean;
  retry?: RetryOptions
}

export enum RetryStrategy {
  None, Retry
}

export interface RetryOptions {
  strategy?: RetryStrategy
  count?: number;
}

@Injectable()
export class HttpWrapperService {

  requestInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  numberOfWaitingRequests = 0;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  get(url: string, options?: any): Observable<HttpResponse<any>> {
    if (!options) {
      options = {};
    }

    return this.http.get(url, {observe: 'response', responseType: 'json', headers: options.headers});
  }

  post(url: string, body: any, requestOptions: any, requestBehaviourOptions?: RequestBehaviourOptions): Observable<HttpResponse<any>> {
    const response: Subject<HttpResponse<any>> = new Subject();

    const ignoreProgress: boolean = requestBehaviourOptions && requestBehaviourOptions.ignoreProgress;
    const failStrategy: FailStrategy = requestBehaviourOptions ? requestBehaviourOptions.failStrategy : FailStrategy.Ignore;
    const retryStrategy: RetryStrategy = (requestBehaviourOptions && requestBehaviourOptions.retry && requestBehaviourOptions.retry.strategy) ? requestBehaviourOptions.retry.strategy : RetryStrategy.None;
    let retryCount: number = this.determineRetryCount(requestBehaviourOptions);
    const ignoreSnack: boolean = true; // Technical Debt: This should not be permanent.

    if (!ignoreProgress) this.setInProgress();

    if (!requestOptions) {
      requestOptions = {};
    }

    this.http.post<any>(url, body, {observe: 'response', responseType: 'json', headers: requestOptions.headers}).subscribe(
      r => {
        if (!ignoreProgress) this.setNotInProgress();

        response.next(r);
        response.complete();
      },
      error => {
        if (retryStrategy === RetryStrategy.Retry && --retryCount > 0) {
          requestBehaviourOptions.retry = { strategy: retryStrategy, count: retryCount };
          return this.post(url, body, requestOptions, requestBehaviourOptions);
        }

        // handle error
        if (!ignoreProgress) this.setNotInProgress();

        if (!ignoreSnack) {
          this.handleError(error);
        }

        if (failStrategy === FailStrategy.Hard) {
          this.router.navigateByUrl('/error');
        }

        if (failStrategy === FailStrategy.HardStandalone) {
          this.router.navigateByUrl('/404');
        }

        response.complete();
      }
    );

    return response;
  }

  postWithError(url: string, body: any, requestOptions: any, requestBehaviourOptions?: RequestBehaviourOptions): Observable<HttpResponse<any> | CustomServerError> {
    const response: Subject<HttpResponse<any> | CustomServerError> = new Subject();

    const ignoreProgress: boolean = requestBehaviourOptions && requestBehaviourOptions.ignoreProgress;
    const failStrategy: FailStrategy = requestBehaviourOptions ? requestBehaviourOptions.failStrategy : FailStrategy.Ignore;
    const retryStrategy: RetryStrategy = (requestBehaviourOptions && requestBehaviourOptions.retry && requestBehaviourOptions.retry.strategy) ? requestBehaviourOptions.retry.strategy : RetryStrategy.None;
    let retryCount: number = this.determineRetryCount(requestBehaviourOptions);
    const ignoreSnack: boolean = true; // Technical Debt: This should not be permanent.

    if (!ignoreProgress) this.setInProgress();

    if (!requestOptions) {
      requestOptions = {};
    }

    this.http.post<any>(url, body, {observe: 'response', responseType: 'json', headers: requestOptions.headers}).subscribe(
      r => {
        if (!ignoreProgress) this.setNotInProgress();

        response.next(r);
        response.complete();
      },
      error => {
        if (retryStrategy === RetryStrategy.Retry && --retryCount > 0) {
          requestBehaviourOptions.retry = { strategy: retryStrategy, count: retryCount };
          return this.postWithError(url, body, requestOptions, requestBehaviourOptions);
        }

        // handle error
        if (!ignoreProgress) this.setNotInProgress();

        if (!ignoreSnack) {
          this.handleError(error);
        }

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

  private determineRetryCount(requestBehaviourOptions: RequestBehaviourOptions) {
    if (!requestBehaviourOptions || !requestBehaviourOptions.retry) {
      return 0;
    }

    if (requestBehaviourOptions.retry.count === 0) {
      return requestBehaviourOptions.retry.count;
    }

    if (!requestBehaviourOptions.retry.count) {
      return 3;
    }

    return requestBehaviourOptions.retry.count;
  }

  handleError(error) {
    if (!error || !error.message) return;

    const duration = error.code === 403 ? 6000 : 3000;
    this.snackbarService.showErrorSnack(error.message, duration);
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

export function extractData(response: HttpResponse<any>) {
  return response.body.response.data;
}

export function generateHeaders(token: string, contentType?: string): HttpHeaders {
  let headers = new HttpHeaders().append('Content-Type', contentType ? contentType : 'application/json').append('Authorization', token);

  return headers;
}
