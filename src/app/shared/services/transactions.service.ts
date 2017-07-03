import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Transaction} from '../models/transaction.model';
import {HttpWrapperService, extractData} from './http-wrapper.service';
import {
  transactionsInfoListQuery, deleteTransactionMutation,
  transactionQuery, refundTransactionMutation
} from '../utils/queries/entities/transaction.queries';

@Injectable()
export class TransactionsService extends AbstractEntityService<Transaction> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
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
  }

  public refundTransaction(transactionId: string, refundAmount: number): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(refundTransactionMutation(transactionId, refundAmount)).subscribe(
      (data) => {
        let json = extractData(data);
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityUpdated$.next(new Transaction(entityData));
      }
    );
  }
}
