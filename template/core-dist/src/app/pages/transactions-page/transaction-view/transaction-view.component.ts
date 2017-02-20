import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';

@Component({
  selector: 'c-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent extends AbstractEntityViewComponent<Transaction> implements OnInit {

  constructor(
    private transactionsService: TransactionsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(transactionsService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Transaction();
    }

    this.init();
  }

}
