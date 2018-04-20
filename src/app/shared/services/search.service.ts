import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  searchQuery, suggestionsQuery, searchFacets, searchAdvancedQuery,
  searchAdvancedFacets, dashboardFiltersQuery, dashboardFiltersAdvancedQuery
} from '../utils/queries/search.queries';
import {
  extractData, HttpWrapperService, generateHeaders, RequestBehaviourOptions,
  FailStrategy
} from './http-wrapper.service';
import {CustomServerError} from "../models/errors/custom-server-error";
import {Customer} from '../models/customer.model';
import {Session} from '../models/session.model';
import {Campaign} from '../models/campaign.model';

@Injectable()
export class SearchService {

  searchResults$: Subject<any>;
  advanceSearchResults$: Subject<any>;
  suggestionResults$: Subject<string[]>;
  dashboardFilterResults$: Subject<any>;
  facets$: Subject<any>;

  private suggestionInput$: Subject<string>;
  private dashboardFilterInput$: Subject<string>;

  constructor(private http: HttpWrapperService, private authService: AuthenticationService) {
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

  searchCustomers(value: string): Observable<Customer[]> {
    return this.searchByEntities(value, ['customer']).map(hits =>
      (hits.hit || []).map(hit =>
        new Customer({ id: hit.id, firstname: hit.fields.firstname, lastname: hit.fields.lastname, email: hit.fields.email, phone: hit.fields.phone })
      )
    )
  }

  searchCampaigns(value: string): Observable<Campaign[]> {
    return this.searchByEntities(value, ['campaign']).map(hits =>
      (hits.hit || []).map(hit => new Campaign({id: hit.id, name: hit.fields.name}))
    )
  }

  searchSessions(value: string): Observable<Session[]> {
    return this.searchByEntities(value, ['session']).map(hits =>
      (hits.hit || []).map(hit =>
        new Session({id: hit.id, alias: hit.fields.alias, created_at: hit.fields.created_at})
      )
    )
  }

  private searchByEntities(value: string, entities: string[]): Observable<any> {
    if (!value) return Observable.of([]);

    const obs = new Subject<any[]>();
    const q = searchQuery(value, null, null, 0, 20, entities);

    this.queryRequest(q, {failStrategy: FailStrategy.Soft}).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      obs.next(this.parseSearchResults(response) || []);
    });

    return obs;
  }

  searchByQuery(query: string | any, createdAtRange: string, sortBy: string, start: number, count: number, entityTypes?: string[]): void {
    let types: string[] = entityTypes;
    if (this.authService.isActiveAclCustomerService()) {
      if (entityTypes && entityTypes.length > 0) {
        types = types.filter(type => type === 'customer' || type === 'product' || type === 'productschedule' || type === 'transaction' || type === 'rebill' || type === 'session');
      } else {
        types = ['customer', 'product', 'productschedule', 'transaction', 'rebill', 'session'];
      }
    }

    let q = '';

    if (typeof query === 'string') {
      q = searchQuery(query, createdAtRange, sortBy, start, count, types);
    } else {
      q = searchAdvancedQuery(query, createdAtRange, sortBy, start, count, types)
    }

    this.queryRequest(q, {failStrategy: FailStrategy.Soft}).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      let hits = this.parseSearchResults(response);

      this.searchResults$.next(hits);
    })
  }

  searchFacets(query: string, createdAtRange: string, entityTypes?: string[]): void {
    let types: string[] = entityTypes;
    if (this.authService.isActiveAclCustomerService()) {
      types = ['customer', 'product', 'productschedule', 'transaction', 'rebill', 'session'];
    }

    let q = '';

    if (typeof query === 'string') {
      q = searchFacets(query, createdAtRange, types);
    } else {
      q = searchAdvancedFacets(query, createdAtRange, types);
    }

    this.queryRequest(q).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      let json = extractData(response).search;
      let facets = JSON.parse(json.facets);

      let obj = {};
      if (facets && facets.entity_type.buckets && facets.entity_type.buckets.length > 0) {
        facets.entity_type.buckets.forEach(bucket => {
          obj[bucket.value] = bucket.count
        } );
      }

      this.facets$.next(obj);
    })
  }

  searchSuggestions(query: string): void {
    this.suggestionInput$.next(query);
  }

  searchDashboardFilters(query: string): void {
    this.dashboardFilterInput$.next(query);
  }

  searchDashboardFiltersAdvanced(query: string, type: string): Observable<any> {
    let obs: Subject<any> = new Subject();

    this.queryRequest(dashboardFiltersAdvancedQuery(query, type)).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      obs.next(this.parseSearchResults(response));
      obs.complete();
    });

    return obs;
  }

  private fetchSuggestions(query: string): void {
    this.queryRequest(suggestionsQuery(query)).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      let hit = extractData(response).search.hits.hit;
      let suggestions: string[] = hit.map(h => JSON.parse(h.fields).suggestion_field_1[0]);

      let seen = [];
      this.suggestionResults$.next(suggestions.filter(el => {
        const duplicate = seen[el];
        seen[el] = true;

        return !duplicate;
      }));
    })
  }

  private fetchDashboardFilters(query: string): void {
    this.queryRequest(dashboardFiltersQuery(query)).subscribe(response => {
      if (response instanceof CustomServerError) {
        return;
      }

      let hits = this.parseSearchResults(response);

      this.dashboardFilterResults$.next(hits);
    })
  }

  private queryRequest(query: string, requestBehaviourOptions?: RequestBehaviourOptions): Observable<CustomServerError | HttpResponse<any>> {
    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    return this.http.postWithError(
      endpoint,
      query,
      { headers: generateHeaders(this.authService.getToken())},
      requestBehaviourOptions);
  }

  private parseSearchResults(response: HttpResponse<any>): any {
    if (response instanceof CustomServerError) {
      return {hit: [], found: 0};
    }

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
