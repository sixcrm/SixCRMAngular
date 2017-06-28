import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs';

@Injectable()
export class HttpWrapperService {

  requestInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  numberOfWaitingRequests = 0;

  constructor(private http: Http) { }

  post(url: string, body: any, options?: RequestOptionsArgs, ignoreProgress?: boolean): Observable<Response> {
    let response: Subject<Response> = new Subject();

    if (!ignoreProgress) this.setInProgress();

    this.http.post(url, body, options).subscribe(
      r => {
        response.next(r);
        response.complete();
      },
      () => {
        // handel error
      },
      () => {
        if (!ignoreProgress) this.setNotInProgress();
      }
    );

    return response;
  }

  setInProgress() {
    if (this.numberOfWaitingRequests++ === 0) {
      this.requestInProgress$.next(true);
    }
  }

  setNotInProgress() {
    if (this.numberOfWaitingRequests === 0) return;

    if (this.numberOfWaitingRequests-- === 1) {
      this.requestInProgress$.next(false);
    }
  }
}

export function extractData(response: Response) {
  return response.json().data.data;
}
