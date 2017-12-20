import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute, Router, Route} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {getCurrencyMask, parseCurrencyMaskedValue} from '../../../shared/utils/mask.utils';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {Products} from '../../../shared/models/products.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent extends AbstractEntityViewComponent<Transaction> implements OnInit, OnDestroy {

  @ViewChild('refundInput') refundInput;

  selectedIndex: number = 0;
  amountToRefund;
  refundAllSelected: boolean = false;

  numberMask = getCurrencyMask();

  amount: string;

  productColumnParams: ColumnParams<Products>[] = [
    new ColumnParams('TRANSACTION_PRODUCT_NAME', (e: Products) => e.product.name),
    new ColumnParams('TRANSACTION_PRODUCT_SKU', (e: Products) => e.product.sku),
    new ColumnParams('TRANSACTION_PRODUCT_AMOUNT', (e: Products) => e.amount.usd(), 'right')
  ];

  productTextOptions: TableMemoryTextOptions = {
    title: 'TRANSACTION_PRODUCT_TITLE',
    viewOptionText: 'TRANSACTION_PRODUCT_VIEW',
    noDataText: 'TRANSACTION_PRODUCT_NODATA'
  };

  constructor(
    private transactionsService: TransactionsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private router: Router
  ) {
    super(transactionsService, route);
  }

  ngOnInit() {
    this.takeUpdated = false;
    super.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.merge(this.service.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(transaction => {
      if (transaction instanceof CustomServerError) {
        return;
      }

      this.amount = transaction.amount.usd();
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  navigateTo(root: string, path: string): void {
    if (path) {
      this.router.navigate([root, path]);
    }
  }

  refundTransaction(): void {
    let amount = parseCurrencyMaskedValue(this.amountToRefund);

    if (amount > this.entity.amount.amount || amount === 0) {
      this.amountToRefund = '$0';
      this.refundInput.nativeElement.focus();
      return;
    }

    this.transactionsService.entityUpdated$.take(1).subscribe(() => {
      this.setIndex(0)
    });
    this.transactionsService.refundTransaction(this.entity.id, amount);
  }

  refundAllSelect(): void {
    if (this.refundAllSelected) {
      this.amountToRefund = this.entity.amount.amount;
    } else {
      this.amountToRefund = '$0';
    }
  }

  setIndex(index: number): void {
    if (index === 1) {
      this.amountToRefund = '$0';
      this.refundAllSelected = false;
    }

    this.selectedIndex = index;
  }

  goToRebill() {
    this.router.navigate(['/rebills', this.entity.rebill.id])
  }

  goToMerchantProvider() {
    this.router.navigate(['/merchantproviders', this.entity.merchantProvider.id])
  }

  goToProduct(products: Products) {
    this.router.navigate(['/products', products.product.id])
  }
}
