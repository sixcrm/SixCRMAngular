import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import {getSchemaQuery} from './queries/schema.query';
import {Type} from './models/type.model';

export interface HeadersInput {
  key: string;
  value: string;
}

@Injectable()
export class GraphqlDocsService {

  constructor(private http: Http) { }

  getSchemaTypes(endpoint: string, headersInput: HeadersInput[]): Observable<Type[]> {
    return this.http.post(endpoint, getSchemaQuery(), { headers: this.generateHeaders(headersInput)})
      .map(response => response.json().data.__schema.types);
  }

  private generateHeaders(headersInput: HeadersInput[]): Headers {
    let headers = new Headers();

    if (headersInput && headersInput.length > 0) {
      Object.keys(headersInput).forEach(key => headers.append(headersInput[key].key, headersInput[key].value))
    }

    return headers;
  }
}
