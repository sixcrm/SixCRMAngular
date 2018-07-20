import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from '../../../../entity-services/services/customers.service';
import {Customer} from '../../../../shared/models/customer.model';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../entity-services/services/transactions.service';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {
  transactionsByCustomer,
  transactionsInfoListQuery
} from '../../../../shared/utils/queries/entities/transaction.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';

@Component({
  selector: 'perfect-customer',
  templateUrl: './perfect-customer.component.html',
  styleUrls: ['./perfect-customer.component.scss']
})
export class PerfectCustomerComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {
  customer: Customer;
  transactions: Transaction[];

  transactionsServerError: CustomServerError;
  transactionsLoading: boolean = false;

  constructor(private customersService: CustomersService, private transactionsService: TransactionsService) {
    super();
  }

  ngOnInit() {
    this.customersService.entity$.takeUntil(this.unsubscribe$).subscribe(customer => {
      if (customer instanceof CustomServerError) {
        this.serverError = customer;
        return;
      }

      this.serverError = null;
      this.customer = customer
    });
    this.transactionsService.entities$.takeUntil(this.unsubscribe$).subscribe(transactions => {
      this.transactionsLoading = false;

      if (transactions instanceof CustomServerError) {
        this.transactionsServerError = transactions;
        return;
      }

      this.transactionsServerError = null;
      if (!transactions) {
        this.transactions = [];
      } else {
        this.transactions = transactions
      }
    });
  }

  refreshTransactions() {
    this.transactionsService.getEntities(5);
    this.transactionsLoading = true;
  }
  ngOnDestroy() {
    super.destroy();
    this.transactionsService.indexQuery = transactionsInfoListQuery;
  }

  fetchPerfect(): void {
    this.customer = undefined;
    this.transactions = [];

    this.transactionsService.indexQuery = (params: IndexQueryParameters) => transactionsByCustomer(this._id, params);
    this.refreshTransactions();
    this.customersService.getEntity(this._id);

  }
}
