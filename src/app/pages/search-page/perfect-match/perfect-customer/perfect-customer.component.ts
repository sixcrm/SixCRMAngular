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

@Component({
  selector: 'perfect-customer',
  templateUrl: './perfect-customer.component.html',
  styleUrls: ['./perfect-customer.component.scss']
})
export class PerfectCustomerComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {
  customer: Customer;
  transactions: Transaction[];

  constructor(private customersService: CustomersService, private transactionsService: TransactionsService) {
    super();
  }

  ngOnInit() {
    this.customersService.entity$.takeUntil(this.unsubscribe$).subscribe(customer => this.customer = customer);
    this.transactionsService.entities$.takeUntil(this.unsubscribe$).subscribe(transactions => {
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
