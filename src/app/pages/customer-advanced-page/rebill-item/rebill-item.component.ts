import {Component, Input, OnInit} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Product} from '../../../shared/models/product.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {MatDialog} from '@angular/material';
import {ViewTransactionDialogComponent} from '../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;

  showTransactions: boolean;
  showTracking: boolean;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  calculateCycle() {
    return 0;
  }

  getProductImage(product: Product) {
    return product.getDefaultImage() ? product.getDefaultImage().path : null;
  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  toggleShipping() {
    this.showTracking = !this.showTracking;
  }

  viewTransaction(transaction: Transaction) {
    let dialogRef = this.dialog.open(ViewTransactionDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.transaction = transaction.copy();

    dialogRef.afterClosed().take(1).subscribe(() => {
      dialogRef = null;
    })
  }
}
