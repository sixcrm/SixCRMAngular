import { Injectable } from '@angular/core';
import {Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class HttpWrapperService extends Http {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions)
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    let response: Subject<Response> = new Subject();

    super.post(url, body, options).subscribe(
      r => {
        response.next(r);
        response.complete();
      },
      () => {
        // handel error
      }
    );

    return response;
  }

}

export function extractData(response: Response) {
  return response.json().data.data;
}
