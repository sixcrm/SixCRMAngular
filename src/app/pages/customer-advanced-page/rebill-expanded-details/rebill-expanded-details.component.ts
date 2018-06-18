import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {MatDialog} from '@angular/material';
import {ViewTransactionDialogComponent} from '../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';

@Component({
  selector: 'rebill-expanded-details',
  templateUrl: './rebill-expanded-details.component.html',
  styleUrls: ['./rebill-expanded-details.component.scss']
})
export class RebillExpandedDetailsComponent implements OnInit {

  @Input() rebill: Rebill;

  @Output() backButtonSelected: EventEmitter<boolean> = new EventEmitter();
  @Output() transactionRefunded: EventEmitter<Transaction> = new EventEmitter();

  showFulfillment: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  toggleShowFulfillment() {
    this.showFulfillment = !this.showFulfillment;
  }

  calculateCycle() {
    return 0;
  }

  showTransactionDetails(transaction: Transaction) {
    let ref = this.dialog.open(ViewTransactionDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transaction = transaction.copy();

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

  openReturnDialog() {
    let ref = this.dialog.open(ReturnDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.products = this.rebill.copy().products.filter(p => !p.returns || p.returns.length === 0);

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

  openRefundDialog() {
    let ref = this.dialog.open(RefundDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transactions = this.rebill.copy().transactions.filter(t => t.type !== 'refund');

    ref.afterClosed().take(1).subscribe((result) => {
      ref = null;

      if (result.refundedTransaction) {
        this.rebill.transactions = [...this.rebill.transactions, result.refundedTransaction];
        this.transactionRefunded.emit(result.refundedTransaction);
      }
    })
  }

}
