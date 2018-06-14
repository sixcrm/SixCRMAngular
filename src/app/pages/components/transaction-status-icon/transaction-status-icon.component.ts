import {Component, OnInit, Input} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';

@Component({
  selector: 'transaction-status-icon',
  templateUrl: './transaction-status-icon.component.html',
  styleUrls: ['./transaction-status-icon.component.scss']
})
export class TransactionStatusIconComponent implements OnInit {

  @Input() transaction: Transaction;
  @Input() largeSize: boolean;

  constructor() { }

  ngOnInit() {
  }

}
