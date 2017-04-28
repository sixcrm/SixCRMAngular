import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Transaction} from '../models/transaction.model';
import {
  transactionsInfoListQuery, transactionQuery, deleteTransactionMutation,
  transactionSummaryQuery
} from '../utils/query-builder';
import {Subject} from 'rxjs';
import {TransactionSummary} from '../models/transaction-summary.model';
import {FilterTerm} from '../../pages/dashboard-page/dashboard.component';

@Injectable()
export class TransactionsService extends AbstractEntityService<Transaction> {

  transactionsSummaries$: Subject<TransactionSummary[]>;

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
  }

  getTransactionSummaries(start: string, end: string, filters: FilterTerm[]): void {
    this.queryRequest(transactionSummaryQuery(start, end, filters)).subscribe(
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
}
