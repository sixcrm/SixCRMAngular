import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Router} from '@angular/router';
import {
  transactionsByCustomer,
  transactionsInfoListQuery
} from '../../../../shared/utils/queries/entities/transaction.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';

@Component({
  selector: 'customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.scss']
})
export class CustomerTransactionsComponent extends AbstractEntityIndexComponent<Transaction> implements OnInit, OnDestroy {

  @Input() id: string;

  constructor(
    transactionsService: TransactionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router
  ) {
    super(transactionsService, auth, dialog, paginationService, router);

    this.columnParams = [
      new ColumnParams('CUSTOMER_TRANSACTION_ALIAS', (e: Transaction) => e.alias),
      new ColumnParams('CUSTOMER_TRANSACTION_RESPONSE', (e: Transaction) => e.processorResponse.message),
      new ColumnParams('CUSTOMER_TRANSACTION_PRODUCTNUM', (e: Transaction) => e.products.length),
      new ColumnParams('CUSTOMER_TRANSACTION_AMOUNT', (e: Transaction) => e.amount.usd(), 'right').setNumberOption(true)
    ];
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => transactionsByCustomer(this.id, params);
    this.init(!!this.id);
  }

  ngOnDestroy() {
    this.service.indexQuery = transactionsInfoListQuery;
    this.destroy();
  }
}
