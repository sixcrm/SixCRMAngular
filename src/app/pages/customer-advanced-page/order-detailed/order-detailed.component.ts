import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {MatDialog} from '@angular/material';
import {ViewTransactionDialogComponent} from '../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';
import {Order} from '../../../shared/models/order.model';

@Component({
  selector: 'order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {

  @Input() order: Order;

  @Output() backButtonSelected: EventEmitter<boolean> = new EventEmitter();

  @Output() refund: EventEmitter<Order> = new EventEmitter();
  @Output() ret: EventEmitter<Order> = new EventEmitter();

  showFulfillment: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  toggleShowFulfillment() {
    this.showFulfillment = !this.showFulfillment;
  }

  showTransactionDetails(transaction: Transaction) {
    let ref = this.dialog.open(ViewTransactionDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transaction = transaction.copy();

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

}
