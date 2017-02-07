import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {Transaction} from '../models/transaction.model';
import {transactionsInfoListQuery, transactionQuery, deleteTransactionMutation} from '../utils/query-builder';

@Injectable()
export class TransactionsService extends AbstractEntityService<Transaction> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Transaction(data),
      transactionsInfoListQuery,
      transactionQuery,
      deleteTransactionMutation
    );
  }
}
