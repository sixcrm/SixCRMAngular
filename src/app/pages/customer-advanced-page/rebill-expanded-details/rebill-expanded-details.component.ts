import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {MatDialog} from '@angular/material';
import {ViewTransactionDialogComponent} from '../../../dialog-modals/view-transaction-dialog/view-transaction-dialog.component';

@Component({
  selector: 'rebill-expanded-details',
  templateUrl: './rebill-expanded-details.component.html',
  styleUrls: ['./rebill-expanded-details.component.scss']
})
export class RebillExpandedDetailsComponent implements OnInit {

  @Input() rebill: Rebill;

  @Output() backButtonSelected: EventEmitter<boolean> = new EventEmitter();

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

}
