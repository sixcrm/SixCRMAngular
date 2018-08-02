import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Transaction} from '../../shared/models/transaction.model';
import { HttpWrapperService, extractData, FailStrategy } from '../../shared/services/http-wrapper.service';
import {
  transactionsInfoListQuery, deleteTransactionMutation,
  transactionQuery, refundTransactionMutation, deleteTransactionsMutation, transactionIDsResponseQuery,
  transactionsByCustomer
} from '../../shared/utils/queries/entities/transaction.queries';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {MatSnackBar} from '@angular/material';
import { Moment } from 'moment';
import {Observable} from 'rxjs';

@Injectable()
export class TransactionsService extends AbstractEntityService<Transaction> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Transaction(data),
      transactionsInfoListQuery,
      transactionQuery,
      deleteTransactionMutation,
      deleteTransactionsMutation,
      null,
      null,
      null,
      'transaction',
      snackBar
    );
  }

  public getTransactionsByCustomer(customerId: string): Observable<Transaction[]> {
    return this.planeCustomEntitiesQuery(transactionsByCustomer(customerId, {}))
  }

  public refundTransaction(transactionId: string, refundAmount: string): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(refundTransactionMutation(transactionId, refundAmount)).subscribe(
      (data) => {
        if (data instanceof CustomServerError) {
          this.entityUpdated$.next(data);
          return;
        }

        let json = extractData(data);
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityUpdated$.next(new Transaction(entityData.transaction));
      }
    );
  }

  public performTransactionRefund(transaction: Transaction, amount: string): Observable<Transaction> {
    if (!this.hasWritePermission()) {
      return Observable.of(null);
    }

    return this.queryRequest(refundTransactionMutation(transaction.id, amount), {failStrategy: FailStrategy.Soft}).map(data => {
      if (data instanceof CustomServerError) {
        return null;
      }

      return new Transaction(extractData(data).refund.transaction);
    })
  }

  public transactionsUntil(date: Moment): void {
    this.getEntities(20, null, {failStrategy: FailStrategy.Soft})
  }

  public getEntitiesForDashboardCheck(): Observable<Transaction[]> {
    return this.planeCustomEntitiesQuery(transactionIDsResponseQuery({limit: 11}))
  }
}
