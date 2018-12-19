import {Component, OnInit, Input} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Products} from '../../../shared/models/products.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {Router, NavigationStart} from '@angular/router';
import {Currency} from '../../../shared/utils/currency/currency';
import {TransactionsService} from '../../../entity-services/services/transactions.service';
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'transaction-single-view',
  templateUrl: './transaction-single-view.component.html',
  styleUrls: ['./transaction-single-view.component.scss']
})
export class TransactionSingleViewComponent implements OnInit {

  _transaction: Transaction;

  amountToRefund: Currency;

  @Input() set transaction(transaction: Transaction) {
    this.amountToRefund = new Currency(0);

    this.tabHeaders  = [
      {name: 'general', label: 'GENERAL DETAILS'}
    ];

    if (transaction && transaction.type === 'sale' && transaction.result === 'success') {
      this.tabHeaders = [
        {name: 'general', label: 'GENERAL DETAILS'},
        {name: 'refund', label: 'REFUND TRANSACTION'}
      ];
    }

    this._transaction = transaction;
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL DETAILS'}
  ];

  selectedIndex: number = 0;

  productColumnParams: ColumnParams<Products>[] = [
    new ColumnParams('Name', (e: Products) => e.product.name),
    new ColumnParams('SKU', (e: Products) => e.product.sku),
    new ColumnParams('Amount', (e: Products) => e.amount.usd(), 'right').setNumberOption(true)
  ];

  productTextOptions: TableMemoryTextOptions = {
    title: 'Associated Products',
    viewOptionText: 'View',
    noDataText: 'No Products Found'
  };

  constructor(
    private router: Router,
    private transactionService: TransactionsService,
    private snackService: SnackbarService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  goToProduct(products: Products) {
    this.router.navigate(['/products', 'product', products.product.id])
  }

  refundAllToggle(event) {
    if (event.checked) {
      this.amountToRefund = this._transaction.amount;
    } else {
      this.amountToRefund = new Currency(0);
    }
  }

  refundTransaction() {
    if (this.amountToRefund.amount > this._transaction.amount.amount) {
      return;
    }

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.transactionService.performTransactionRefund(this._transaction, this.amountToRefund.amount.toFixed(2) + '').subscribe(refundedTransaction => {
      this.navigationService.setShowProcessingOrderOverlay(false);

      if (!refundedTransaction) {
        return;
      }

      this.snackService.showSuccessSnack(`Transaction successfully refunded for ${this.amountToRefund.usd()}`, 3000);
    })
  }

}
