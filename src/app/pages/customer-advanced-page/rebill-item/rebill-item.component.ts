import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ReturnDialogComponent} from '../../../dialog-modals/return-dialog/return-dialog.component';
import {RefundDialogComponent} from '../../../dialog-modals/refund-dialog/refund-dialog.component';
import {Transaction} from '../../../shared/models/transaction.model';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() pending: boolean;

  @Output() rebillSelected: EventEmitter<Rebill> = new EventEmitter();
  @Output() transactionRefunded: EventEmitter<Transaction> = new EventEmitter();

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  navigateToWatermark(rebill: Rebill) {
    this.router.navigate(['/sessions', rebill.parentSession.id], {fragment: 'watermark'})
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

  canRefund() {
    const numberOfSales = this.rebill.transactions.filter(t => t.type === 'sale');
    const numberOfRefunds = this.rebill.transactions.filter(t => t.type === 'refund');

    return numberOfSales > numberOfRefunds;
  }

  canReturn() {
    return this.rebill.products.filter(p => !!p.product.ship && (!p.returns || p.returns.length === 0)).length > 0;
  }
}
