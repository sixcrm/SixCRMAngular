import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
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
export class GraphqlDocs2Service {

  hash: string;

  private schemaTypes: Type[];
  public selectedItem: string;
  public filterString: string;

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

  public getSchemaTypes(endpoint: string, headersInput: HeadersInput[]): Observable<Type[]> {
    if (this.schemaTypes) {
      return Observable.of(this.schemaTypes);
    }

    return this.http.post(endpoint, getSchemaQuery(), {headers: this.generateHeaders(headersInput)})
      .map(response => {
        this.schemaTypes = response.body.response.data.__schema.types;

        return this.schemaTypes;
      });
  }

  private generateHeaders(headersInput: HeadersInput[]): HttpHeaders {
    let headers = new HttpHeaders();

    if (headersInput && headersInput.length > 0) {
      for (let headerInput of headersInput) {
        headers = headers.append(headerInput.key, headerInput.value)
      }
    }

    return headers;
  }
}
