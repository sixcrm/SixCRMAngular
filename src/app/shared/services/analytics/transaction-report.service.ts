import { Injectable } from '@angular/core';
import {TransactionReport} from '../../models/analytics/transaction-report.model';
import {Subject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {
  transactionReportListQuery, transactionsSumReport,
  transactionsSumTotalReport
} from '../../utils/queries/reports.queries';
import { HttpResponse} from '@angular/common/http';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';
import {downloadJSON} from '../../utils/file.utils';
import {extractData, HttpWrapperService, generateHeaders} from '../http-wrapper.service';
import {TransactionsSumItem} from '../../models/analytics/transactions-sum-item.model';

@Injectable()
export class TransactionReportService {

  transactions$: Subject<TransactionReport[]>;
  transactionsSumItems$: Subject<TransactionsSumItem[]>;
  transactionsSumTotal$: Subject<TransactionsSumItem>;

  constructor(private authService: AuthenticationService, private http: HttpWrapperService) {
    this.transactions$ = new Subject();
    this.transactionsSumItems$ = new Subject();
    this.transactionsSumTotal$ = new Subject();
  }

  getTransactions(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(transactionReportListQuery(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let transactions = extractData(data).transactionsreport.transactions;

          if (transactions) {
            this.transactions$.next(transactions.map(transaction => new TransactionReport(transaction)))
          }
        } else {
          downloadJSON(data.body, 'transactions-details-report');
        }
      })
  }

  getTransactionsSum(start: string, end: string, filters: FilterTerm[], download?: boolean, limit?: number, offset?: number, order?: string) {
    this.queryRequest(transactionsSumReport(start, end, filters, download, limit, offset, order), download).subscribe(
      (data) => {
        if (!download) {
          let transactionsSumItems = extractData(data).transactionsummaryreport.periods;

          if (transactionsSumItems) {
            this.transactionsSumItems$.next(transactionsSumItems.map(t => new TransactionsSumItem(t)));
          }
        } else {
          downloadJSON(data.body.response, 'transaction-summary-report');
        }
      })
  }

  getTransactionsSumTotal(start: string, end: string, filters: FilterTerm[], download?: boolean) {
    this.queryRequest(transactionsSumTotalReport(start, end, filters), download).subscribe(
      (data) => {
        if (!download) {
          let transactionsSumTotal = extractData(data).transactionsummaryreportsummary;

          if (transactionsSumTotal) {
            this.transactionsSumTotal$.next(new TransactionsSumItem(transactionsSumTotal));
          }
        } else {
          downloadJSON(data.body.response, 'transaction-summary-total-report');
        }
      })
  }

  private queryRequest(query: string, download: boolean): Observable<HttpResponse<any>> {
    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
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
