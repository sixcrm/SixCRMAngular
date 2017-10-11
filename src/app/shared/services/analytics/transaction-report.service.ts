import { Injectable } from '@angular/core';
import {TransactionReport} from '../../models/analytics/transaction-report.model';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {transactionReportListQuery, transactionsSumReport} from '../../utils/queries/reports.queries';
import { Response} from '@angular/http';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../../utils/file.utils';
import {extractData, HttpWrapperService, generateHeaders} from '../http-wrapper.service';
import {TransactionsSum} from '../../models/analytics/transactions-sum.model';

@Injectable()
export class TransactionReportService {

  transactions$: Subject<TransactionReport[]>;
  transactionsSum$: Subject<TransactionsSum>;

  constructor(private authService: AuthenticationService, private http: HttpWrapperService) {
    this.transactions$ = new Subject();
    this.transactionsSum$ = new Subject();
  }

  getTransactions(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(transactionReportListQuery(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let transactions = extractData(data).listtransactions.transactions;

          if (transactions) {
            this.transactions$.next(transactions.map(transaction => new TransactionReport(transaction)))
          }
        } else {
          downloadJSON(data.json(), 'transactions-report.json');
        }
      })
  }

  getTransactionsSum(start: string, end: string, filters: FilterTerm[], download?: boolean) {
    this.queryRequest(transactionsSumReport(start, end, filters), download).subscribe(
      (data) => {
        if (!download) {
          let sum = extractData(data).transactionreport;

          if (sum) {
            this.transactionsSum$.next(new TransactionsSum(sum));
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

    return this.http.post(endpoint, query, { headers: generateHeaders(this.authService.getToken())});
  }
}
