import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Response, Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {searchQuery, suggestionsQuery} from '../utils/query-builder';

@Injectable()
export class SearchService {

  searchResults$: Subject<any>;
  suggestionResults$: Subject<string[]>;

  private suggestionInput$: Subject<string>;

  constructor(private http: Http, private authService: AuthenticationService) {
    this.searchResults$ = new Subject<any[]>();
    this.suggestionResults$ = new Subject<string[]>();
    this.suggestionInput$ = new Subject<string>();

    this.suggestionInput$.debounceTime(300).filter(q => !!q).subscribe((query) => {
      this.fetchSuggestions(query);
    })
  }

  searchByQuery(query: string, start: number, count: number): void {
    this.queryRequest(searchQuery(query, start, count)).subscribe(
      (response: Response) => {
        let json = response.json().data.search;
        let data = json.hits;

        this.searchResults$.next(data);
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
        let json = response.json().data.suggest;
        let data: string[] = json.suggest.suggestions.map(s => s.suggestion);

        this.suggestionResults$.next(data);
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
