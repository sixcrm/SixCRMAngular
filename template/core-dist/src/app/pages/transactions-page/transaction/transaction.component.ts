import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Transaction} from '../../../shared/models/transaction.model';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {TransactionsService} from '../../../shared/services/transactions.service';

@Component({
  selector: 'transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent extends AbstractEntityComponent<Transaction> implements OnInit {

  constructor(service: TransactionsService, progressBarService: ProgressBarService) {
    super(service, progressBarService)
  }

  ngOnInit() {
    this.init();
  }

}
