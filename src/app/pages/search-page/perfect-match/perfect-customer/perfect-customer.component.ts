import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CustomersService} from '../../../../shared/services/customers.service';
import {Customer} from '../../../../shared/models/customer.model';
import {AsyncSubject} from 'rxjs';
import {Transaction} from '../../../../shared/models/transaction.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {transactionsInfoListQuery, transactionsByCustomer} from '../../../../shared/utils/query-builder';

@Component({
  selector: 'perfect-customer',
  templateUrl: './perfect-customer.component.html',
  styleUrls: ['./perfect-customer.component.scss']
})
export class PerfectCustomerComponent implements OnInit, OnDestroy {

  @Input() id: string;

  customer: Customer;
  transactions: Transaction[];
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private customersService: CustomersService, private transactionsService: TransactionsService) { }

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
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    this.transactionsService.indexQuery = transactionsInfoListQuery;
  }

}
