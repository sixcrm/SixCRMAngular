import {Component, OnInit, Input} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {TransactionsService} from '../../../entity-services/services/transactions.service';
import {Transaction} from '../../../shared/models/transaction.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {
  transactionsByCustomer,
  transactionsInfoListQuery
} from '../../../shared/utils/queries/entities/transaction.queries';
import {IndexQueryParameters} from '../../../shared/utils/queries/index-query-parameters.model';
import {Subscription} from 'rxjs';
import {OptionItem} from '../../components/table-memory-advanced/table-memory-advanced.component';

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
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  columnParams: ColumnParams<Transaction>[] = [];
  rowColorFunction = (e: Transaction) => e.chargeback ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';
  options: OptionItem[] = [
    {label: 'Refund', visible: (e: Transaction) => e.type === 'sale'},
    {label: 'Notify User', visible: (e: Transaction) => true},
    {label: 'View Details', visible: (e: Transaction) => true}
  ];

  bulkOptions: string[] = ['Refund'];

  sub: Subscription;

  constructor(
    private transactionService: TransactionsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_TRANSACTION_DATE', (e: Transaction) => e.createdAt.tz(f).format('MM/DD/YY h:mm A')),
      new ColumnParams('CUSTOMER_TRANSACTION_STATUS', (e: Transaction) => e.getStatus())
        .setMaterialIconMapper((e: Transaction) => e.chargeback || e.isError() ? 'error' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Transaction) => e.chargeback || e.isError() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Transaction) => e.chargeback || e.isError() ? '#DC2547' : '#ffffff'),
      new ColumnParams('CUSTOMER_TRANSACTION_ORDER', (e: Transaction) => e.rebill.parentSession.alias).setClickable(true).setColor('#2C98F0').setSeparator(true),
      new ColumnParams('CUSTOMER_TRANSACTION_AMOUNT', (e: Transaction) => e.amount.usd()),
      new ColumnParams('CUSTOMER_TRANSACTION_REFUND', (e: Transaction) => e.type === 'refund' ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('CUSTOMER_TRANSACTION_CHARGEBACK', (e: Transaction) => e.chargeback ? e.amount.usd() : '-').setAlign('center'),
      new ColumnParams('CUSTOMER_TRANSACTION_MID', (e: Transaction) => e.merchantProvider.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_TRANSACTION_ALIAS', (e: Transaction) => e.alias).setSeparator(true).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_TRANSACTION_MESSAGE', (e: Transaction) => e.processorResponse.message)
    ]
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.transactionService.indexQuery = transactionsInfoListQuery;

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  initialize() {
    this.transactionService.indexQuery = (params: IndexQueryParameters) => transactionsByCustomer(this._customer.id, params);

    this.sub = this.transactionService.entities$.subscribe(transactions => {
      if (transactions instanceof CustomServerError) return;

      this.transactions = transactions;
    });

    this.transactionService.getEntities();
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
