import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../shared/models/transaction.model';
import {MatDialogRef} from '@angular/material';
import {Currency} from '../../shared/utils/currency/currency';

@Component({
  selector: 'refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  transactions: RefundableTransaction[] = [];

  constructor(private dialogRef: MatDialogRef<RefundDialogComponent>) { }

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

  getTotalRefundable(): Currency {
    return new Currency(this.transactions.map(t => t.amount.amount).reduce((a,b) => a+b, 0));
  }

  getTotalToBeRefunded(): Currency {
    return new Currency(this.transactions.filter(t => t.selected).map(t => t.toBeRefunded ? t.toBeRefunded.amount : t.amount.amount).reduce((a,b) => a+b, 0));
  }

}

interface RefundableTransaction extends Transaction {
  selected?: boolean;
  toBeRefunded?: Currency;
}
