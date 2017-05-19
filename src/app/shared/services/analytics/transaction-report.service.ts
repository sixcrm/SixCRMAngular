import { Injectable } from '@angular/core';
import {TransactionReport} from '../../models/analytics/transaction-report.model';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {transactionReportListQuery} from '../../utils/queries/reports.queries';
import {Http, Headers, Response} from '@angular/http';

@Injectable()
export class TransactionReportService {

  transactions$: Subject<TransactionReport[]>;

  constructor(private authService: AuthenticationService, private http: Http) {
    this.transactions$ = new Subject();
  }

  getTransactions(start: string, end: string, limit?: number, offset?: number, order?: string) {
    this.queryRequest(transactionReportListQuery(start, end, limit, offset, order)).subscribe(
      (data) => {
        let transactions = data.json().data.listtransactions.transactions;

        if (transactions) {
          this.transactions$.next(transactions.map(transaction => new TransactionReport(transaction)))
        }
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
