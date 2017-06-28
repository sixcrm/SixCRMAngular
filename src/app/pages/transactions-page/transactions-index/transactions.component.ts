import {Component, OnInit, OnDestroy} from '@angular/core';
import {TransactionsService} from "../../../shared/services/transactions.service";
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit, OnDestroy {

  constructor(
    transactionsService: TransactionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(transactionsService, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Alias', (e: Transaction) => e.alias),
      new ColumnParams('Amount', (e: Transaction) => e.amount.usd(), 'right'),
      new ColumnParams('Created At',(e: Transaction) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Processor Response', (e: Transaction) => e.processorResponse.message)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
