import {Component, OnInit, Input} from '@angular/core';
import {Customer} from '../../../../shared/models/customer.model';
import {TransactionsService} from '../../../../shared/services/transactions.service';
import {Transaction} from '../../../../shared/models/transaction.model';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'customer-advanced-transactions',
  templateUrl: './customer-advanced-transactions.component.html',
  styleUrls: ['./customer-advanced-transactions.component.scss']
})
export class CustomerAdvancedTransactionsComponent implements OnInit {

  _customer: Customer;

  transactions: Transaction[] = [];

  @Input() set customer(customer: Customer) {
    if (customer) {
      this._customer = customer;
      this.initialize();
    }
  }

  columnParams: ColumnParams<Transaction>[] = [];

  options: string[] = ['Refund', 'Return', 'Notify User', 'View Details'];
  bulkOptions: string[] = ['Refund', 'Return'];

  constructor(
    private transactionService: TransactionsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_TRANSACTION_STATUS', (e: Transaction) => e.processorResponse.message),
      new ColumnParams('CUSTOMER_TRANSACTION_AMOUNT', (e: Transaction) => e.amount.usd()),
      new ColumnParams('CUSTOMER_TRANSACTION_REFUND', (e: Transaction) => '-').setAlign('center'),
      new ColumnParams('CUSTOMER_TRANSACTION_CHARGEBACK', (e: Transaction) => '-').setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_TRANSACTION_DATE', (e: Transaction) => e.createdAt.tz(f).format('MM/DD/YY h:mm A')),
      new ColumnParams('CUSTOMER_TRANSACTION_MID', (e: Transaction) => e.merchantProvider.id).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_TRANSACTION_ALIAS', (e: Transaction) => e.alias).setSeparator(true).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_TRANSACTION_ORDER', (e: Transaction) => e.rebill.parentSession.alias).setClickable(true).setColor('#2C98F0')
    ]
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.transactionService.indexQuery = transactionsInfoListQuery;
  }

  initialize() {
    // this.transactionService.indexQuery = (params: IndexQueryParameters) => transactionsByCustomer(this._customer.id, params);

    this.transactionService.entities$.take(1).subscribe(transactions => {
      if (transactions instanceof CustomServerError) return;

      this.transactions = transactions;
    });

    // this.transactionService.getEntities();
    this.transactionService.getEntities(5);
  }

  itemClicked(option: {item: Transaction, param: ColumnParams<Transaction>}) {
    switch (option.param.label) {
      case ('CUSTOMER_TRANSACTION_MID'): {
        this.router.navigate(['/merchantproviders', option.item.merchantProvider.id]);
        break
      }
      case ('CUSTOMER_TRANSACTION_ALIAS'): {
        this.router.navigate(['/transactions', option.item.id]);
        break
      }
      case ('CUSTOMER_TRANSACTION_ORDER'): {
        this.router.navigate(['/sessions', option.item.rebill.parentSession.id]);
        break
      }
      default: {}
    }
  }

}
