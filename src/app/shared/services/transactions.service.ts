import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Transaction} from '../models/transaction.model';
import {
  transactionsInfoListQuery, transactionQuery, deleteTransactionMutation,
  transactionSummaryQuery, transactionOverviewQuery
} from '../utils/query-builder';
import {Subject} from 'rxjs';
import {TransactionSummary} from '../models/transaction-summary.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';
import {TransactionOverview} from '../models/transaction-overview.model';

@Injectable()
export class TransactionsService extends AbstractEntityService<Transaction> {

  transactionsSummaries$: Subject<TransactionSummary[]>;
  transactionsOverview$: Subject<TransactionOverview>;

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Transaction(data),
      transactionsInfoListQuery,
      transactionQuery,
      deleteTransactionMutation,
      null,
      null,
      'transaction'
    );

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
}
