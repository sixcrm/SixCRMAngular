import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from '../../../../shared/services/customers.service';
import {Customer} from '../../../../shared/models/customer.model';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {
  transactionsByCustomer,
  transactionsInfoListQuery
} from '../../../../shared/utils/queries/entities/transaction.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-customer',
  templateUrl: './perfect-customer.component.html',
  styleUrls: ['./perfect-customer.component.scss']
})
export class PerfectCustomerComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {
  customer: Customer;
  transactions: Transaction[];

  transactionsServerError: CustomServerError;

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

    this.customersService.getEntity(this.id);

    this.transactionsService.indexQuery = (limit?: number, cursor?: string) => transactionsByCustomer(this.id, limit, cursor);
    this.transactionsService.getEntities(5);
  }

  ngOnDestroy() {
    super.destroy();
    this.transactionsService.indexQuery = transactionsInfoListQuery;
  }
}
