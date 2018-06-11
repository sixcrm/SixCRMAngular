import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../shared/models/transaction.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'view-transaction-dialog',
  templateUrl: './view-transaction-dialog.component.html',
  styleUrls: ['./view-transaction-dialog.component.scss']
})
export class ViewTransactionDialogComponent implements OnInit {

  transaction: Transaction;

  constructor(private dialogRef: MatDialogRef<ViewTransactionDialogComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close({});
  }

  isChargeback() {
    return this.transaction && this.transaction.chargeback;
  }

}
