import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent extends AbstractEntityViewComponent<Transaction> implements OnInit {

  constructor(
    service: TransactionsService,
    route: ActivatedRoute,
    progressBar: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init();
  }
}
