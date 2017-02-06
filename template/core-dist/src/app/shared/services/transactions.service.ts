import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Transaction} from '../models/transaction.model';
import {Subject} from 'rxjs';
import {transactionsInfoListQuery, transactionQuery} from '../utils/query-builder';

@Injectable()
export class TransactionsService extends AbstractEntityService {
  transactions$: Subject<Transaction[]>;
  transaction$: Subject<Transaction>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);

    this.transactions$ = new Subject<Transaction[]>();
    this.transaction$ = new Subject<Transaction>();
  }

  getTransactions(): void {
    this.queryRequest(transactionsInfoListQuery()).subscribe(
      (data) => {
        let transactionsData = data.json().data.transactionlist.transactions;
        this.transactions$.next(transactionsData.map(transaction => new Transaction(transaction)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getTransaction(id: string): void {
    this.queryRequest(transactionQuery(id)).subscribe(
      (data) => {
        let transactionData = data.json().data.transaction;
        this.transaction$.next(new Transaction(transactionData));
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
