import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {EventFunnel} from '../models/event-funnel.model';
import {eventsFunelQuery, transactionSummaryQuery, transactionOverviewQuery} from '../utils/query-builder';
import {Headers, Response, Http} from '@angular/http';
import {TransactionOverview} from '../models/transaction-overview.model';
import {TransactionSummary} from '../models/transaction-summary.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';

@Injectable()
export class AnalyticsService {

  eventFunnel$: Subject<EventFunnel>;
  transactionsSummaries$: Subject<TransactionSummary[]>;
  transactionsOverview$: Subject<TransactionOverview>;

  constructor(private authService: AuthenticationService, private http: Http) {
    this.eventFunnel$ = new Subject();
    this.transactionsSummaries$ = new Subject();
    this.transactionsOverview$ = new Subject();
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[], additionalFilters?: any[]): void {
    this.queryRequest(transactionSummaryQuery(start, end, filters, additionalFilters)).subscribe(
      (data) => {
        let transactions = data.json().data.transactionsummary.transactions;

        if (transactions) {
          this.transactionsSummaries$.next(transactions.map(t => new TransactionSummary(t)))
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getTransactionOverview(start: string, end: string): void {
    this.queryRequest(transactionOverviewQuery(start, end)).subscribe(
      (data) => {
        let overview = data.json().data.transactionoverview.overview;

        if (overview) {
          this.transactionsOverview$.next(new TransactionOverview(overview));
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getEventFunnel(start: string, end: string): void {
    this.queryRequest(eventsFunelQuery(start, end)).subscribe((data) => {
      let funnel = data.json().data.eventfunnel.funnel;

      this.eventFunnel$.next(new EventFunnel(funnel));
    })
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
