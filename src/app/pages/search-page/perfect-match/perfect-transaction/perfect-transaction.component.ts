import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-transaction',
  templateUrl: './perfect-transaction.component.html',
  styleUrls: ['./perfect-transaction.component.scss']
})
export class PerfectTransactionComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  transaction: Transaction;

  constructor(private transactionService: TransactionsService) {
    super();
  }

  ngOnInit() {
    this.transactionService.entity$.takeUntil(this.unsubscribe$).subscribe(transaction => {
      if (transaction instanceof CustomServerError) {
        this.serverError = transaction;
        return;
      }

      this.serverError = null;
      this.transaction = transaction
    });

    this.transactionService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
