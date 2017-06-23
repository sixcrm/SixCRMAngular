import { Injectable } from '@angular/core';
import {TransactionReport} from '../../models/analytics/transaction-report.model';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {transactionReportListQuery} from '../../utils/queries/reports.queries';
import {Http, Headers, Response} from '@angular/http';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../../utils/file.utils';


@Injectable()
export class TransactionReportService {

  transactions$: Subject<TransactionReport[]>;

  constructor(private authService: AuthenticationService, private http: Http) {
    this.transactions$ = new Subject();
  }

  getTransactions(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(transactionReportListQuery(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let transactions = data.json().data.listtransactions.transactions;

          if (transactions) {
            this.transactions$.next(transactions.map(transaction => new TransactionReport(transaction)))
          }
        } else {
          downloadJSON(data.json(), 'transactions-report.json');
        }
      })
  }

  private queryRequest(query: string, download: boolean): Observable<Response> {
    let endpoint = environment.endpoint;

    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    if (download) {
      endpoint += '?download=json';
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
