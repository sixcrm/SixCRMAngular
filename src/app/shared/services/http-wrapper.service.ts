import { Injectable } from '@angular/core';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class HttpWrapperService {

  requestInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  numberOfWaitingRequests = 0;

  constructor(private http: Http, private snackBar: MdSnackBar) { }

  post(url: string, body: any, options?: RequestOptionsArgs, ignoreProgress?: boolean): Observable<Response> {
    let response: Subject<Response> = new Subject();

    if (!ignoreProgress) this.setInProgress();

    this.http.post(url, body, options).subscribe(
      r => {
        if (!ignoreProgress) this.setNotInProgress();

        response.next(r);
        response.complete();
      },
      (error) => {
        // handel error
        if (!ignoreProgress) this.setNotInProgress();

        this.snackBar.open(`${error.json().error_type}: ${error.json().message}`, 'close', {duration: 3000});
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
