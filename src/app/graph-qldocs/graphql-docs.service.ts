import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getSchemaQuery} from './queries/schema.query';
import {Type} from './models/type.model';
import {HttpWrapperService} from '../shared/services/http-wrapper.service';
import {ActivatedRoute} from '@angular/router';
import {navigateToFieldByString} from './utils';

export interface HeadersInput {
  key: string;
  value: string;
}

@Injectable()
export class GraphqlDocsService {

  hash: string;

  constructor(private http: HttpWrapperService, private route: ActivatedRoute) { }

  navigateByAnchor() {
    this.route.fragment.take(1).subscribe(fragment => {
      this.hash = fragment;

      setTimeout(() => {
        if (this.hash) {
          navigateToFieldByString(this.hash);
        }
      }, 500);
    });
  }

  getSchemaTypes(endpoint: string, headersInput: HeadersInput[]): Observable<Type[]> {
    return this.http.post(endpoint, getSchemaQuery(), { headers: this.generateHeaders(headersInput)})
      .map(response => response.body.json().response.data.__schema.types);
  }

  private generateHeaders(headersInput: HeadersInput[]): HttpHeaders {
    let headers = new HttpHeaders();

    if (headersInput && headersInput.length > 0) {
      Object.keys(headersInput).forEach(key => headers.append(headersInput[key].key, headersInput[key].value))
    }

    return headers;
  }
}
