import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class PaginationService {

  limit$: BehaviorSubject<number>;
  searchResultsLimit$: BehaviorSubject<number>;

  constructor() {
    this.limit$ = new BehaviorSubject(10);
    this.searchResultsLimit$ = new BehaviorSubject(10);
  }

  setLimit(limit: number): void {
    this.limit$.next(limit)
  }

}
