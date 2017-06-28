import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Response, Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  searchQuery, suggestionsQuery, searchFacets, searchAdvancedQuery,
  searchAdvancedFacets, dashboardFiltersQuery, dashboardFiltersAdvancedQuery
} from '../utils/queries/search.queries';
import {extractData} from './http-wrapper.service';

@Injectable()
export class SearchService {

  searchResults$: Subject<any>;
  advanceSearchResults$: Subject<any>;
  suggestionResults$: Subject<string[]>;
  dashboardFilterResults$: Subject<any>;
  facets$: Subject<any>;

  private suggestionInput$: Subject<string>;
  private dashboardFilterInput$: Subject<string>;

  constructor(private http: Http, private authService: AuthenticationService) {
    this.searchResults$ = new Subject<any[]>();
    this.advanceSearchResults$ = new Subject<any[]>();
    this.suggestionResults$ = new Subject<string[]>();
    this.suggestionInput$ = new Subject<string>();
    this.dashboardFilterInput$ = new Subject<string>();
    this.dashboardFilterResults$ = new Subject<string[]>();
    this.facets$ = new Subject<any>();

    this.suggestionInput$.debounceTime(300).filter(q => !!q).subscribe((query) => {
      this.fetchSuggestions(query);
    });

    this.dashboardFilterInput$.debounceTime(300).filter(q => !!q).subscribe((query) => {
      this.fetchDashboardFilters(query);
    })
  }

  searchByQuery(query: string | any, createdAtRange: string, sortBy: string, start: number, count: number, entityTypes?: string[]): void {
    let types: string[] = entityTypes;
    if (this.authService.isActiveAclCustomerService()) {
      if (entityTypes && entityTypes.length > 0) {
        types = types.filter(type => type === 'customer' || type === 'product' || type === 'productschedule' || type === 'transaction' || type === 'rebill');
      } else {
        types = ['customer', 'product', 'productschedule', 'transaction', 'rebill'];
      }
    }

    let q = '';

    if (typeof query === 'string') {
      q = searchQuery(query, createdAtRange, sortBy, start, count, types);
    } else {
      q = searchAdvancedQuery(query, createdAtRange, sortBy, start, count, types)
    }

    this.queryRequest(q).subscribe(
      (response: Response) => {
        let hits = this.parseSearchResults(response);

        this.searchResults$.next(hits);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  searchFacets(query: string, createdAtRange: string, entityTypes?: string[]): void {
    let types: string[] = entityTypes;
    if (this.authService.isActiveAclCustomerService()) {
      types = ['customer', 'product', 'productschedule', 'transaction', 'rebill'];
    }

    let q = '';

    if (typeof query === 'string') {
      q = searchFacets(query, createdAtRange, types);
    } else {
      q = searchAdvancedFacets(query, createdAtRange, types);
    }

    this.queryRequest(q).subscribe(
      (response: Response) => {
        let json = extractData(response).search;
        let facets = JSON.parse(json.facets);

        let obj = {};
        if (facets && facets.entity_type.buckets && facets.entity_type.buckets.length > 0) {
          facets.entity_type.buckets.forEach(bucket => {
            obj[bucket.value] = bucket.count
          } );
        }

        this.facets$.next(obj);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  searchSuggestions(query: string): void {
    this.suggestionInput$.next(query);
  }

  searchDashboardFilters(query: string): void {
    this.dashboardFilterInput$.next(query);
  }

  searchDashboardFiltersAdvanced(query: string, type: string): Observable<any> {
    let obs: Subject<any> = new Subject();

    this.queryRequest(dashboardFiltersAdvancedQuery(query, type)).subscribe(
      (response: Response) => {
        obs.next(this.parseSearchResults(response));
        obs.complete();
      }
    );

    return obs;
  }

  private fetchSuggestions(query: string): void {
    this.queryRequest(suggestionsQuery(query)).subscribe(
      (response: Response) => {
        let hit = extractData(response).search.hits.hit;
        let suggestions: string[] = hit.map(h => JSON.parse(h.fields).suggestion_field_1[0]);

        this.suggestionResults$.next(suggestions);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  private fetchDashboardFilters(query: string): void {
    this.queryRequest(dashboardFiltersQuery(query)).subscribe(
      (response: Response) => {
        let hits = this.parseSearchResults(response);

        this.dashboardFilterResults$.next(hits);
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

  private parseSearchResults(response: Response): any {
    let json = extractData(response).search;
    let hits = json.hits;

    hits.hit = hits.hit.map(hit => {
      hit.fields = JSON.parse(hit.fields);
      for (let property in hit.fields) {
        hit.fields[property] = hit.fields[property][0];
      }

      return hit;
    });

    return hits;
  }
}
