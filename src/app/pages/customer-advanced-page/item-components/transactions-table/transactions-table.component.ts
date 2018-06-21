import {Component, OnInit, Input} from '@angular/core';
import {Transaction} from '../../../../shared/models/transaction.model';
import {MatDialog} from '@angular/material';
import {ViewTransactionDialogComponent} from '../../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';

@Component({
  selector: 'transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  @Input() transactions: Transaction[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  showTransactionDetails(transaction: Transaction) {
    let ref = this.dialog.open(ViewTransactionDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.componentInstance.transaction = transaction.copy();

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    })
  }

}
