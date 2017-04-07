import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Response, Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  searchQuery, suggestionsQuery, searchFacets, searchAdvancedQuery,
  searchAdvancedFacets
} from '../utils/query-builder';

@Injectable()
export class SearchService {

  searchResults$: Subject<any>;
  advanceSearchResults$: Subject<any>;
  suggestionResults$: Subject<string[]>;
  entityTypesCount$: Subject<any>;

  private suggestionInput$: Subject<string>;

  constructor(private http: Http, private authService: AuthenticationService) {
    this.searchResults$ = new Subject<any[]>();
    this.advanceSearchResults$ = new Subject<any[]>();
    this.suggestionResults$ = new Subject<string[]>();
    this.suggestionInput$ = new Subject<string>();
    this.entityTypesCount$ = new Subject<any>();

    this.suggestionInput$.debounceTime(300).filter(q => !!q).subscribe((query) => {
      this.fetchSuggestions(query);
    })
  }

  searchByQuery(query: string | any, createdAtRange: string, start: number, count: number, entityTypes?: string[]): void {
    let q = '';

    if (typeof query === 'string') {
      q = searchQuery(query, createdAtRange, start, count, entityTypes);
    } else {
      q = searchAdvancedQuery(query, createdAtRange, start, count, entityTypes)
    }

    this.queryRequest(q).subscribe(
      (response: Response) => {
        let json = response.json().data.search;
        let hits = json.hits;

        hits.hit = hits.hit.map(hit => {
          hit.fields = JSON.parse(hit.fields);
          for (let property in hit.fields) {
            hit.fields[property] = hit.fields[property][0];
          }

          return hit;
        });

        this.searchResults$.next(hits);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  searchFacets(query: string, createdAtRange: string): void {
    let q = '';

    if (typeof query === 'string') {
      q = searchFacets(query, createdAtRange);
    } else {
      q = searchAdvancedFacets(query, createdAtRange);
    }

    this.queryRequest(q).subscribe(
      (response: Response) => {
        let json = response.json().data.search;
        let facets = JSON.parse(json.facets);

        let obj = {};
        if (facets && facets.entity_type.buckets && facets.entity_type.buckets.length > 0) {
          facets.entity_type.buckets.forEach(bucket => {
            obj[bucket.value] = bucket.count
          } );
        }

        this.entityTypesCount$.next(obj);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  searchSuggestions(query: string): void {
    this.suggestionInput$.next(query);
  }

  private fetchSuggestions(query: string): void {
    this.queryRequest(suggestionsQuery(query)).subscribe(
      (response: Response) => {
        let hit = response.json().data.search.hits.hit;
        let suggestions: string[] = hit.map(h => JSON.parse(h.fields).suggestion_field_1[0]);

        this.suggestionResults$.next(suggestions);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  private queryRequest(query: string): Observable<Response> {
    let endpoint = environment.endpoint;

    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint = endpoint + this.authService.getActiveAcl().account.id;
    } else {
      endpoint = endpoint + '*';
    }

    return this.http.post(endpoint, query, { headers: this.generateHeaders()});
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }

}
