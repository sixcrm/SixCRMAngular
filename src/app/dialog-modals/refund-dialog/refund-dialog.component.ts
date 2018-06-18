import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../shared/models/transaction.model';
import {MatDialogRef} from '@angular/material';
import {Currency} from '../../shared/utils/currency/currency';
import {TransactionsService} from '../../entity-services/services/transactions.service';
import {NavigationService} from '../../navigation/navigation.service';

@Component({
  selector: 'refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  transactions: RefundableTransaction[] = [];

  constructor(
    private dialogRef: MatDialogRef<RefundDialogComponent>,
    private transactionService: TransactionsService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close({});
  }

  globalCheckboxClicked(event) {
    for (let t of this.transactions) {
      t.selected = event.checked;
    }
  }

  canRefund(): boolean {
    const total = this.getTotalToBeRefunded().amount;

    return total > 0;
  }

  getTotalRefundable(): Currency {
    return new Currency(this.transactions.map(t => t.amount.amount).reduce((a,b) => a+b, 0));
  }

  getTotalToBeRefunded(): Currency {
    return new Currency(this.transactions.filter(t => t.selected).map(t => t.toBeRefunded ? t.toBeRefunded.amount : t.amount.amount).reduce((a,b) => a+b, 0));
  }

  refund() {
    if (!this.canRefund()) return;

    const transactionsToBeRefunded = this.transactions.filter(t => t.selected);

    if (transactionsToBeRefunded.length > 0) {
    const firstTransactionToBeRefunded = transactionsToBeRefunded[0];

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.transactionService
      .performTransactionRefund(firstTransactionToBeRefunded, firstTransactionToBeRefunded.toBeRefunded.amount.toFixed(2) + '')
      .subscribe(response => {
        this.navigationService.setShowProcessingOrderOverlay(false);
        this.dialogRef.close({refundedTransaction: response})
      });
    }
  }

}

interface RefundableTransaction extends Transaction {
  selected?: boolean;
  toBeRefunded?: Currency;
}
