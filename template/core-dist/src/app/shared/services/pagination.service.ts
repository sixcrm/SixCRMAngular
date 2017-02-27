import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class PaginationService {

  limit$: BehaviorSubject<number>;

  constructor() {
    this.limit$ = new BehaviorSubject(10);
  }

  setLimit(limit: number): void {
    this.limit$.next(limit)
  }

}
