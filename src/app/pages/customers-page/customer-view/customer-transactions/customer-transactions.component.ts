import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {transactionsByCustomer, transactionsInfoListQuery} from '../../../../shared/utils/query-builder';
import {ColumnParams} from '../../../../shared/models/column-params.model';

@Component({
  selector: 'customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.scss']
})
export class CustomerTransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit, OnDestroy {

  @Input() id: string;
  filterValue: string;

  constructor(
    transactionsService: TransactionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(transactionsService, auth, dialog, progressBarService, paginationService);

    this.columnParams = [
      new ColumnParams('ID', (e: Transaction) => e.id),
      new ColumnParams('Date',(e: Transaction) => e.createdAt.format('MM/DD/YYYY')),
      new ColumnParams('Amount', (e: Transaction) => e.amount),
      new ColumnParams('Processor Response', (e: Transaction) => e.processorResponse.message)
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => transactionsByCustomer(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = transactionsInfoListQuery;
    this.destroy();
  }

}
